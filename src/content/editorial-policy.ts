import type { CategorySlug } from "@/domain/lesson";

/**
 * Política editorial da plataforma. Tudo que depende de decisão rabínica fica
 * aqui, para que a revisão do Beit Din não exija mexer em código de telas.
 * Veja docs/CONFORMIDADE-HALACHICA.md.
 */
export const EDITORIAL_POLICY = {
  /** Categorias fora do ar até orientação rabínica (música: questão de kol ishá). */
  hiddenCategories: ["musica"] as CategorySlug[],
  /** Grupos da biblioteca listados apenas com link externo, até orientação rabínica. */
  linkOnlyLibraryGroups: ["Modern Commentary on Tanakh"],
  /** IDs de vídeos do YouTube retirados individualmente do acervo. */
  hiddenLessonIds: [] as string[],
  /** Em Shabat e Yom Tov (hora de São Paulo) doações e formulários ficam suspensos. */
  pauseOnSacredTime: true,
};
