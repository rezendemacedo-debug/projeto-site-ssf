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
      <Ark />
      {children}
    </section>
  );
}

/** Silhueta original: telhados planos e a muralha de Jerusalém com seus portais em arco. */
function Skyline() {
  return (
    <svg className="skyline" viewBox="0 0 1600 300" preserveAspectRatio="xMidYMax slice" fill="currentColor" aria-hidden="true">
      <path className="houses" d="M0 300V170h110v-30h90v46h70v-70h60v-34h70v34h50v60h90v-26h120v40h60v-88h100v62h80v-44h70v76h110v-40h60v-60h90v84h100v-34h80v50h90v-72h70v60h30v112Z" />
      <path className="wall" fillRule="evenodd" d="M0 300V214h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16h24v-16h16v16V300Z M350 300v-38a24 24 0 0 1 48 0v38Z M1130 300v-46a30 30 0 0 1 60 0v46Z" />
    </svg>
  );
}

/** Aron Hakodesh: arco de pedra, parochet azul com as Tábuas e a chama do Ner Tamid. */
function Ark() {
  return (
    <svg className="ark" viewBox="0 0 400 560" aria-hidden="true">
      <path d="M20 560V200a180 180 0 0 1 360 0v360Z" fill="#d3bd92" stroke="#8d6f3c" strokeWidth="4" />
      <g stroke="#a98a52" strokeWidth="2">
        {[-72, -48, -24, 0, 24, 48, 72].map((a) => <path key={a} d="M200 22V62" transform={`rotate(${a} 200 200)`} />)}
        {[250, 310, 370, 430, 490].map((y) => <path key={y} d={`M20 ${y}h42M338 ${y}h42`} />)}
      </g>
      <path d="M62 560V206a138 138 0 0 1 276 0v354Z" fill="#3a2413" stroke="#d9b25f" strokeWidth="5" />
      <path d="M88 560V250h224v310Z" fill="#1b3468" />
      <g fill="#142a56">{[104, 148, 192, 236, 280].map((x) => <path key={x} d={`M${x} 250h16v310h-16Z`} />)}</g>
      <path d="M80 240h240v18H80Z" fill="#d9b25f" />
      <path d="M88 258h224v14l-14 12-14-12-14 12-14-12-14 12-14-12-14 12-14-12-14 12-14-12-14 12-14-12-14 12-14-12-14 12-14-12Z" fill="#b98a2f" />
      <text x="200" y="222" textAnchor="middle" fill="#e8c878" fontSize="25" direction="rtl" lang="he" style={{ fontFamily: "var(--book)" }}>דע לפני מי אתה עומד</text>
      {/* Tábuas quadradas, como em Bava Batra 14a. */}
      <path d="M134 446v-96h62v96ZM204 446v-96h62v96Z" fill="none" stroke="#e8c878" strokeWidth="4" />
      <g fill="#e8c878" fontSize="17" textAnchor="middle" style={{ fontFamily: "var(--book)" }}>
        {["א", "ב", "ג", "ד", "ה"].map((l, i) => <text key={l} x="235" y={368 + i * 17}>{l}</text>)}
        {["ו", "ז", "ח", "ט", "י"].map((l, i) => <text key={l} x="165" y={368 + i * 17}>{l}</text>)}
      </g>
      <path d="M200 72v46" stroke="#d9b25f" strokeWidth="3" />
      <path d="M178 118h44l-9 30h-26Z" fill="#b98a2f" />
      <path className="flame" d="M200 84c12 13 13 25 0 33-13-8-12-20 0-33Z" fill="#ffd27a" />
    </svg>
  );
}
