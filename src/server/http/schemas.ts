import { z } from "zod";
import { CATEGORIES } from "@/domain/lesson";

const text = (max: number) => z.string().trim().max(max);
const name = text(120).min(2, "Informe seu nome.");
const email = z.string().trim().toLowerCase().max(200).pipe(z.email("Informe um e-mail válido."));

export const contactSchema = z.object({
  name, email,
  subject: text(120).min(2, "Informe o assunto."),
  body: text(4000).min(10, "Escreva uma mensagem um pouco mais longa."),
});

export const registerSchema = z.object({
  name, email,
  password: z.string().min(10, "A senha precisa de pelo menos 10 caracteres.").max(200),
  city: text(120),
  motivation: text(2000),
  consent: z.literal("on", { error: "É preciso aceitar a política de privacidade." }),
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
