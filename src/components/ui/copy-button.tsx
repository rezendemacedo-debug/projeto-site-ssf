"use client";

import { useState } from "react";

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [status, setStatus] = useState(label);
  return (
    <button
      type="button"
      className="btn"
      onClick={() => navigator.clipboard.writeText(text).then(() => setStatus("Copiado"), () => setStatus("Selecione e copie o código"))}
    >
      <span aria-live="polite">{status}</span>
    </button>
  );
}
