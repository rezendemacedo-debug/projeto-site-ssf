import { SIGNUP_STEPS } from "@/domain/membership";

/** Indicador das etapas do cadastro (1 a 4). */
export function SignupSteps({ current }: { current: number }) {
  return (
    <ol className="signup-steps" aria-label="Etapas do cadastro">
      {SIGNUP_STEPS.map((label, i) => (
        <li key={label} aria-current={i + 1 === current ? "step" : undefined} data-done={i + 1 < current}>
          <span>{i + 1}</span>{label}
        </li>
      ))}
    </ol>
  );
}
