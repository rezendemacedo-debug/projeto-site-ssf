import { migrate } from "drizzle-orm/libsql/migrator";
import { beforeEach, describe, expect, it } from "vitest";
import { memberMessage, memberWhatsAppUrl } from "@/domain/membership";
import { createDatabase } from "@/server/db/client";
import { codeSchema, profileSchema, signupSchema } from "@/server/http/schemas";
import { EmailCodeRepository } from "@/server/repositories/email-code-repository";
import { UserRepository } from "@/server/repositories/user-repository";
import type { Email, Mailer } from "@/server/services/mailer";
import { MemberSignupService } from "@/server/services/member-signup-service";
import { PasswordHasher } from "@/server/services/password-hasher";

class FakeMailer implements Mailer {
  sent: Email[] = [];
  async send(email: Email) {
    this.sent.push(email);
  }
  lastCode() {
    return this.sent.at(-1)?.text.match(/\b(\d{6})\b/)?.[1] ?? "";
  }
}

const DATA = { title: "Sr.", givenName: "Davi", familyName: "Levi", email: "davi@example.com", password: "senha-de-teste" };

describe("cadastro de membro", () => {
  let mailer: FakeMailer;
  let users: UserRepository;
  let service: MemberSignupService;
  let now: Date;

  beforeEach(async () => {
    const db = createDatabase("file::memory:");
    await migrate(db, { migrationsFolder: "./drizzle" });
    mailer = new FakeMailer();
    users = new UserRepository(db);
    now = new Date("2026-11-26T12:00:00Z");
    service = new MemberSignupService(users, new EmailCodeRepository(db), new PasswordHasher(), mailer, "https://site", () => now);
  });

  const minutes = (n: number) => (now = new Date(now.getTime() + n * 60_000));

  it("envia código de 6 dígitos e confirma o e-mail", async () => {
    const token = await service.start(DATA);
    expect(mailer.sent).toHaveLength(1);
    expect(mailer.sent[0]!.text).toContain("15 minutos");
    expect(await service.verifiedMember(token)).toBeNull();

    expect(await service.confirm(token, mailer.lastCode())).toBe("ok");
    const member = await service.verifiedMember(token);
    expect(member).toMatchObject({ name: "Davi Levi", title: "Sr.", status: "pending" });
    expect(member?.emailVerifiedAt).toBeInstanceOf(Date);
    expect(member).not.toHaveProperty("passwordHash");
  });

  it("recusa código vencido após 15 minutos", async () => {
    const token = await service.start(DATA);
    minutes(15);
    expect(await service.confirm(token, mailer.lastCode())).toBe("expired");
  });

  it("bloqueia após 5 tentativas erradas e libera com novo código", async () => {
    const token = await service.start(DATA);
    const wrong = mailer.lastCode() === "000000" ? "111111" : "000000";
    for (let i = 0; i < 4; i++) expect(await service.confirm(token, wrong)).toBe("invalid");
    expect(await service.confirm(token, wrong)).toBe("locked");
    expect(await service.confirm(token, mailer.lastCode())).toBe("locked");

    expect(await service.resend(token)).toBe("wait");
    minutes(1);
    expect(await service.resend(token)).toBe("sent");
    expect(await service.confirm(token, mailer.lastCode())).toBe("ok");
  });

  it("não aceita token desconhecido nem perfil antes da confirmação", async () => {
    const token = await service.start(DATA);
    expect(await service.confirm("outro-token", mailer.lastCode())).toBe("invalid");
    expect(await service.saveProfile(token, { phone: "1" })).toBe(false);
  });

  it("e-mail já confirmado recebe só um aviso, sem revelar a conta na tela", async () => {
    const first = await service.start(DATA);
    await service.confirm(first, mailer.lastCode());
    const second = await service.start({ ...DATA, givenName: "Outro" });
    expect(mailer.sent.at(-1)!.subject).toContain("já tem cadastro");
    expect(await service.confirm(second, "123456")).toBe("invalid");
    expect((await users.findByEmail(DATA.email))?.givenName).toBe("Davi");
  });

  it("cadastro nunca confirmado recomeça do zero", async () => {
    await service.start(DATA);
    const token = await service.start({ ...DATA, givenName: "Daniel" });
    expect(await service.confirm(token, mailer.lastCode())).toBe("ok");
    expect((await service.verifiedMember(token))?.givenName).toBe("Daniel");
  });

  it("salva o perfil depois da confirmação", async () => {
    const token = await service.start(DATA);
    await service.confirm(token, mailer.lastCode());
    expect(await service.saveProfile(token, { phone: "+55 11 99999-0000", tier: "neshama", shabbatCity: "jerusalem" })).toBe(true);
    expect(await service.verifiedMember(token)).toMatchObject({ phone: "+55 11 99999-0000", tier: "neshama" });
  });
});

describe("mensagem do WhatsApp", () => {
  it("cita a categoria escolhida e só os campos preenchidos", () => {
    const text = memberMessage({ title: "Sra.", givenName: "Ana", familyName: "Cohen", email: "a@b.com", city: "Recife", country: "Brasil", birthDate: "1990-04-05", shabbatCity: "recife", tier: "nefesh" });
    expect(text.split("\n")[0]).toBe("Shalom! Gostaria de saber como me tornar membro NEFESH.");
    expect(text).toContain("Nome: Sra. Ana Cohen");
    expect(text).toContain("Cidade: Recife, Brasil");
    expect(text).toContain("Nascimento: 05/04/1990");
    expect(text).not.toContain("Telefone");
  });
  it("sem categoria definida, cita as duas", () => {
    expect(memberMessage({ givenName: "Ana", familyName: "Cohen", email: "a@b.com", tier: "indeciso" })).toMatch(/^Shalom! Gostaria de saber como me tornar membro NEFESH\/NESHAMÁ\./);
  });
  it("monta o link do WhatsApp com o texto codificado", () => {
    expect(memberWhatsAppUrl("https://wa.me/5511930069900", { givenName: "Ana", familyName: "Cohen", email: "a@b.com" })).toMatch(/^https:\/\/wa\.me\/5511930069900\?text=Shalom!%20/);
  });
});

describe("validação do cadastro", () => {
  it("exige nome, sobrenome, e-mail, senha e consentimento", () => {
    expect(signupSchema.safeParse({ ...DATA, consent: "on" }).success).toBe(true);
    expect(signupSchema.safeParse({ ...DATA, password: "curta", consent: "on" }).success).toBe(false);
    expect(signupSchema.safeParse({ ...DATA }).success).toBe(false);
    expect(signupSchema.safeParse({ ...DATA, title: "Rei", consent: "on" }).success).toBe(false);
  });
  it("código tem exatamente 6 números", () => {
    expect(codeSchema.safeParse({ code: " 012345 " }).success).toBe(true);
    expect(codeSchema.safeParse({ code: "12345" }).success).toBe(false);
  });
  it("perfil aceita vazio e recusa valores fora da lista", () => {
    expect(profileSchema.parse({})).toMatchObject({ phone: "", tier: "" });
    expect(profileSchema.safeParse({ tier: "ouro" }).success).toBe(false);
    expect(profileSchema.safeParse({ shabbatCity: "marte" }).success).toBe(false);
    expect(profileSchema.safeParse({ birthDate: "1990-13-40" }).success).toBe(false);
  });
});
