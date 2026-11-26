import { CITIES } from "@/domain/cities";
import { JEWISH_STATUS, MEMBERSHIP_TIERS, SEXES } from "@/domain/membership";

/** Erros e valores devolvidos pelo servidor (ou pela validação no navegador). */
export interface FieldState {
  errors?: Record<string, string>;
  values?: Record<string, string>;
}

export function FieldError({ state, name }: { state: FieldState; name: string }) {
  const message = state.errors?.[name];
  return message ? <span className="error" role="alert">{message}</span> : null;
}

function Text({ name, label, state, type = "text", autoComplete }: { name: string; label: string; state: FieldState; type?: string; autoComplete?: string }) {
  return (
    <label>
      {label}
      <input name={name} type={type} autoComplete={autoComplete} defaultValue={state.values?.[name]} aria-invalid={!!state.errors?.[name]} />
      <FieldError state={state} name={name} />
    </label>
  );
}

function Choice({ name, legend, options, state }: { name: string; legend: string; options: readonly { value: string; label: string; detail?: string }[]; state: FieldState }) {
  return (
    <fieldset className="choice">
      <legend>{legend}</legend>
      {options.map((o) => (
        <label key={o.value} className="check">
          <input type="radio" name={name} value={o.value} defaultChecked={state.values?.[name] === o.value} />
          <span>{o.detail ? <><strong>{o.label}</strong> <span className="muted">({o.detail})</span></> : o.label}</span>
        </label>
      ))}
      <FieldError state={state} name={name} />
    </fieldset>
  );
}

/** Perfil do membro, todo opcional, como no Chabad.org (sem newsletter). */
export function ProfileFields({ state }: { state: FieldState }) {
  return (
    <>
      <Text name="phone" label="Telefone / WhatsApp" type="tel" autoComplete="tel" state={state} />
      <Text name="address" label="Endereço" autoComplete="address-line1" state={state} />
      <Text name="addressLine2" label="Complemento" autoComplete="address-line2" state={state} />
      <div className="form-row">
        <Text name="city" label="Cidade" autoComplete="address-level2" state={state} />
        <Text name="state" label="Estado" autoComplete="address-level1" state={state} />
      </div>
      <div className="form-row">
        <Text name="postalCode" label="CEP" autoComplete="postal-code" state={state} />
        <Text name="country" label="País" autoComplete="country-name" state={state} />
      </div>
      <Choice name="jewishStatus" legend="Eu sou" options={JEWISH_STATUS} state={state} />
      <Choice name="sex" legend="Sexo" options={SEXES} state={state} />
      <Text name="birthDate" label="Data de nascimento" type="date" autoComplete="bday" state={state} />
      <label>
        Cidade para os horários de Shabat e festas
        <select name="shabbatCity" defaultValue={state.values?.shabbatCity ?? ""}><option value="">Escolher depois</option>{CITIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select>
        <FieldError state={state} name="shabbatCity" />
      </label>
      <Choice name="tier" legend="Categoria de membro" options={MEMBERSHIP_TIERS} state={state} />
    </>
  );
}

/** Título, nome e sobrenome (etapa 1). */
export function NameFields({ titles, state }: { titles: readonly string[]; state: FieldState }) {
  return (
    <>
      <label>Título<select name="title" defaultValue={state.values?.title ?? ""} autoComplete="honorific-prefix"><option value="">—</option>{titles.map((t) => <option key={t}>{t}</option>)}</select></label>
      <div className="form-row">
        <label>Nome<input name="givenName" required autoComplete="given-name" defaultValue={state.values?.givenName} aria-invalid={!!state.errors?.givenName} /><FieldError state={state} name="givenName" /></label>
        <label>Sobrenome<input name="familyName" required autoComplete="family-name" defaultValue={state.values?.familyName} aria-invalid={!!state.errors?.familyName} /><FieldError state={state} name="familyName" /></label>
      </div>
    </>
  );
}
