"use client";

import type { ComponentProps } from "react";

/** Aplica o filtro assim que a opção muda, sem clicar em Filtrar. */
export function AutoSubmitSelect(props: ComponentProps<"select">) {
  return <select {...props} onChange={(e) => e.currentTarget.form?.requestSubmit()} />;
}
