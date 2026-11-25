import type { ReactNode } from "react";
import type { SkyPhase } from "@/domain/sky";

/** Estrelas determinísticas: mesma posição no servidor e no cliente. */
const STARS = Array.from({ length: 110 }, (_, i) => ({ x: (i * 619) % 1600, y: (i * 383) % 640, r: 0.6 + (i % 4) * 0.35 }));

export function SkyHero({ phase, children }: { phase: SkyPhase; children: ReactNode }) {
  return (
    <section className="sky" data-phase={phase}>
      <svg className="stars" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" fill="#fff" aria-hidden="true">
        {STARS.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} opacity={0.35 + (i % 5) * 0.12} />)}
      </svg>
      <svg className="three" viewBox="0 0 240 150" fill="currentColor" aria-hidden="true">
        {[[30, 100, 9], [120, 36, 12], [206, 84, 8]].map(([x, y, r]) => (
          <g key={x}>
            <circle cx={x} cy={y} r={r! * 1.9} opacity=".16" />
            <circle cx={x} cy={y} r={r! / 1.9} />
          </g>
        ))}
      </svg>
      <Skyline />
      {children}
    </section>
  );
}

/** Silhueta original: telhados planos e a muralha de Jerusalém com seus portais em arco. */
function Skyline() {
  return (
    <svg className="skyline" viewBox="0 0 1600 300" preserveAspectRatio="xMidYMax slice" fill="currentColor" aria-hidden="true">
      <path opacity=".45" d="M0 300V170h110v-30h90v46h70v-70h60v-34h70v34h50v60h90v-26h120v40h60v-88h100v62h80v-44h70v76h110v-40h60v-60h90v84h100v-34h80v50h90v-72h70v60h30v112Z" />
      <path fillRule="evenodd" d="M0 300V214h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16V300Z M350 300v-38a24 24 0 0 1 48 0v38Z M1130 300v-46a30 30 0 0 1 60 0v46Z" />
    </svg>
  );
}
