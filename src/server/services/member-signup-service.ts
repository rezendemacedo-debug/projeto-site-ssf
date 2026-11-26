import { createHash, createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import type { EmailCodeRepository } from "../repositories/email-code-repository";
import type { ProfileFields, UserRepository } from "../repositories/user-repository";
import type { Mailer } from "./mailer";
import type { PasswordHasher } from "./password-hasher";

export const CODE_TTL_MINUTES = 15;
export const MAX_ATTEMPTS = 5;
export const RESEND_INTERVAL_SECONDS = 60;

export interface SignupData {
  title: string;
  givenName: string;
  familyName: string;
  email: string;
  password: string;
}

export type ConfirmResult = "ok" | "invalid" | "expired" | "locked";
export type ResendResult = "sent" | "wait";

/**
 * Cadastro de membro em etapas, como no Chabad.org: dados mínimos, código de 6 dígitos
 * por e-mail (15 minutos), perfil e, por fim, contato pelo WhatsApp. A conta continua
 * pendente até a aprovação da administração.
 *
 * O navegador guarda só um token aleatório (cookie). O banco guarda o hash do token e um
 * HMAC do código com o próprio token como chave: quem lê o banco não descobre o código.
 */
export class MemberSignupService {
  constructor(
    private readonly users: UserRepository,
    private readonly codes: EmailCodeRepository,
    private readonly hasher: PasswordHasher,
    private readonly mailer: Mailer,
    private readonly siteUrl: string,
    private readonly now: () => Date = () => new Date(),
  ) {}

  /** Cria o cadastro e envia o código. Devolve o token da etapa, mesmo se o e-mail já tiver conta. */
  async start(data: SignupData) {
    const token = randomBytes(32).toString("base64url");
    const existing = await this.users.findByEmail(data.email);

    if (existing?.emailVerifiedAt) {
      // Mesma resposta para quem já tem conta: o aviso vai só para o dono do e-mail.
      await this.mailer.send({
        to: data.email,
        subject: "Você já tem cadastro na Sinagoga Sem Fronteiras",
        text: `Shalom!\n\nRecebemos um novo pedido de cadastro com este e-mail, mas ele já está cadastrado.\nPara entrar, acesse ${this.siteUrl}/entrar\n\nSe não foi você, ignore esta mensagem.\n\nSinagoga Sem Fronteiras`,
      });
      return token;
    }
    // Cadastro nunca confirmado: ninguém provou ser dono do e-mail, então recomeça do zero.
    if (existing) await this.users.delete(existing.id);

    const userId = crypto.randomUUID();
    const name = `${data.givenName} ${data.familyName}`.trim();
    await this.users.create({
      id: userId, name, email: data.email, title: data.title, givenName: data.givenName, familyName: data.familyName,
      passwordHash: await this.hasher.hash(data.password), role: "member", status: "pending", createdAt: this.now(),
    });
    const code = newCode();
    await this.codes.create({
      tokenHash: digest(token), userId, codeHash: codeHash(token, code),
      expiresAt: this.expiry(), attempts: 0, sentAt: this.now(), verifiedAt: null,
    });
    await this.sendCode(data.email, data.givenName, code);
    return token;
  }

  async confirm(token: string, code: string): Promise<ConfirmResult> {
    const row = await this.codes.find(digest(token));
    if (!row) return "invalid";
    if (row.verifiedAt) return "ok";
    if (row.attempts >= MAX_ATTEMPTS) return "locked";
    if (row.expiresAt <= this.now()) return "expired";
    if (!safeEqual(row.codeHash, codeHash(token, code.trim()))) {
      const attempts = row.attempts + 1;
      await this.codes.update(row.tokenHash, { attempts });
      return attempts >= MAX_ATTEMPTS ? "locked" : "invalid";
    }
    const at = this.now();
    await this.codes.update(row.tokenHash, { verifiedAt: at });
    await this.users.markEmailVerified(row.userId, at);
    return "ok";
  }

  /** Novo código, com novo prazo e tentativas zeradas. Sem cadastro, finge que enviou. */
  async resend(token: string): Promise<ResendResult> {
    const row = await this.codes.find(digest(token));
    if (!row || row.verifiedAt) return "sent";
    if (this.now().getTime() - row.sentAt.getTime() < RESEND_INTERVAL_SECONDS * 1000) return "wait";
    const user = await this.users.findById(row.userId);
    if (!user) return "sent";
    const code = newCode();
    await this.codes.update(row.tokenHash, { codeHash: codeHash(token, code), expiresAt: this.expiry(), attempts: 0, sentAt: this.now() });
    await this.sendCode(user.email, user.givenName, code);
    return "sent";
  }

  /** Membro cujo e-mail foi confirmado nesta etapa; null se o token não vale. */
  async verifiedMember(token: string) {
    const row = await this.codes.find(digest(token));
    if (!row?.verifiedAt) return null;
    return (await this.users.findById(row.userId)) ?? null;
  }

  async saveProfile(token: string, profile: ProfileFields) {
    const member = await this.verifiedMember(token);
    if (!member) return false;
    await this.users.updateProfile(member.id, profile);
    return true;
  }

  private expiry() {
    return new Date(this.now().getTime() + CODE_TTL_MINUTES * 60_000);
  }

  private sendCode(to: string, givenName: string, code: string) {
    return this.mailer.send({
      to,
      subject: `${code} é o seu código da Sinagoga Sem Fronteiras`,
      text: `Shalom, ${givenName}!\n\nSeu código de confirmação é: ${code}\n\nEle vale por ${CODE_TTL_MINUTES} minutos. Digite-o na página do cadastro para continuar.\n\nSe não foi você, ignore esta mensagem.\n\nSinagoga Sem Fronteiras`,
    });
  }
}

function newCode() {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function codeHash(token: string, code: string) {
  return createHmac("sha256", token).update(code).digest("hex");
}

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
