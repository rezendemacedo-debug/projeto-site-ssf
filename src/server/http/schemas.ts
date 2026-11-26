import { z } from "zod";
import { CITIES } from "@/domain/cities";
import { CATEGORIES } from "@/domain/lesson";
import { JEWISH_STATUS, MEMBERSHIP_TIERS, SEXES, TITLES } from "@/domain/membership";

const text = (max: number) => z.string().trim().max(max);
const name = text(120).min(2, "Informe seu nome.");
const email = z.string().trim().toLowerCase().max(200).pipe(z.email("Informe um e-mail válido."));

const password = z.string().min(10, "A senha precisa de pelo menos 10 caracteres.").max(200);

export const contactSchema = z.object({
  name, email,
  subject: text(120).min(2, "Informe o assunto."),
  body: text(4000).min(10, "Escreva uma mensagem um pouco mais longa."),
});

const optional = (max: number) => text(max).optional().default("");
/** Campo de escolha: aceita só valores da lista ou vazio. */
const choice = (values: readonly string[]) => z.union([z.enum(values as [string, ...string[]]), z.literal("")]).optional().default("");

/** Etapa 1 do cadastro de membro. */
export const signupSchema = z.object({
  title: choice(TITLES),
  givenName: text(80).min(2, "Informe seu nome."),
  familyName: text(80).min(2, "Informe seu sobrenome."),
  email,
  password,
  consent: z.literal("on", { error: "É preciso aceitar a política de privacidade." }),
});

/** Etapa 2: código de 6 dígitos. */
export const codeSchema = z.object({ code: z.string().trim().regex(/^\d{6}$/, "Digite os 6 números do código.") });

/** Etapa 3: perfil, todo opcional. */
export const profileSchema = z.object({
  phone: optional(40),
  address: optional(160),
  addressLine2: optional(160),
  city: optional(120),
  state: optional(80),
  postalCode: optional(20),
  country: optional(80),
  jewishStatus: choice(JEWISH_STATUS.map((o) => o.value)),
  sex: choice(SEXES.map((o) => o.value)),
  birthDate: z.union([z.iso.date("Data inválida."), z.literal("")]).optional().default(""),
  shabbatCity: choice(CITIES.map((c) => c.slug)),
  tier: choice(MEMBERSHIP_TIERS.map((o) => o.value)),
});

export const loginSchema = z.object({ email, password: z.string().min(1, "Informe a senha.").max(200) });

const slugs = CATEGORIES.map((c) => c.slug);

/** Filtros da URL: valores inválidos são ignorados em vez de gerar erro. */
export const lessonQuerySchema = z.object({
  search: text(100).optional().catch(undefined),
  category: z.enum(slugs).optional().catch(undefined),
  kind: z.enum(["aula", "live"]).optional().catch(undefined),
  series: text(60).optional().catch(undefined),
  sort: z.enum(["recentes", "antigas", "populares"]).optional().catch(undefined),
  page: z.coerce.number().int().min(1).max(1000).optional().catch(undefined),
});

/** Traduz os parâmetros em português da URL pública para a consulta interna. */
export function parseLessonParams(p: Record<string, string | string[] | undefined>) {
  return lessonQuerySchema.parse({ search: p.q, category: p.tema, kind: p.tipo, series: p.serie, sort: p.ordem, page: p.pagina });
}
