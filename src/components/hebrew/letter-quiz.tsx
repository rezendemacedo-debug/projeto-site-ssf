"use client";

import { useState } from "react";
import { LETTERS } from "@/content/hebrew";

function question(i: number) {
  // Passos coprimos com 22: percorre todas as letras sem repetir opções.
  const answer = LETTERS[(i * 7) % 22]!;
  const options = [0, 5, 9, 14].map((d) => LETTERS[((i * 7) % 22 + d) % 22]!);
  const shift = i % 4;
  return { answer, options: [...options.slice(shift), ...options.slice(0, shift)] };
}

export function LetterQuiz() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const { answer, options } = question(index);

  return (
    <div className="quiz">
      <p className="g" lang="he">{answer.glyph}</p>
      <div className="opts">
        {options.map((o) => (
          <button
            key={o.name} type="button" className="btn ghost" disabled={picked !== null}
            onClick={() => { setPicked(o.name); if (o.name === answer.name) setScore(score + 1); }}
          >{o.name}</button>
        ))}
      </div>
      <p aria-live="polite">{picked === null ? "Que letra é esta?" : picked === answer.name ? `Certo. Som: ${answer.sound}.` : `Esta é ${answer.name}. Som: ${answer.sound}.`}</p>
      <p className="muted">{score} {score === 1 ? "acerto" : "acertos"}</p>
      {picked !== null && <button type="button" className="btn" onClick={() => { setIndex(index + 1); setPicked(null); }}>Próxima letra</button>}
    </div>
  );
}
