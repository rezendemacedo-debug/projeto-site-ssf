import { findCity } from "./cities";

/**
 * Categorias de membro, como constam no site oficial da SSF (minhasinagoga.com).
 * Valores de contribuição só mudam com confirmação da direção.
 */
export const MEMBERSHIP_TIERS = [
  { value: "nefesh", label: "NEFESH", detail: "contribuição entre R$ 50 e R$ 179" },
  { value: "neshama", label: "NESHAMÁ", detail: "contribuição a partir de R$ 180" },
  { value: "indeciso", label: "Ainda não sei", detail: "quero conversar antes" },
] as const;

export const TITLES = ["Sr.", "Sra.", "Srta.", "Dr.", "Dra.", "Prof.", "Profa.", "Rabino", "Outro"] as const;

export const SEXES = [
  { value: "masculino", label: "Masculino" },
  { value: "feminino", label: "Feminino" },
] as const;

export const JEWISH_STATUS = [
  { value: "judeu", label: "Judeu(ia)" },
  { value: "nao-judeu", label: "Não judeu(ia)" },
] as const;

/** Etapas do cadastro, na ordem em que aparecem. */
export const SIGNUP_STEPS = ["Cadastro", "Confirmação", "Perfil", "WhatsApp"] as const;

export type MembershipTier = (typeof MEMBERSHIP_TIERS)[number]["value"];
export type Sex = (typeof SEXES)[number]["value"];
export type JewishStatus = (typeof JEWISH_STATUS)[number]["value"];

/** Dados do pedido de membro; só nome e e-mail são obrigatórios. */
export interface MemberProfile {
  title?: string;
  givenName: string;
  familyName: string;
  email: string;
  phone?: string;
  address?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  jewishStatus?: JewishStatus | (string & {});
  sex?: Sex | (string & {});
  birthDate?: string;
  shabbatCity?: string;
  tier?: MembershipTier | (string & {});
}

const label = <T extends { value: string; label: string }>(list: readonly T[], value?: string) => list.find((i) => i.value === value)?.label;

/** Primeira linha da mensagem: cita a categoria escolhida ou as duas, se a pessoa ainda não decidiu. */
export function memberGreeting(tier?: MemberProfile["tier"]) {
  const chosen = tier === "nefesh" || tier === "neshama" ? label(MEMBERSHIP_TIERS, tier) : "NEFESH/NESHAMÁ";
  return `Shalom! Gostaria de saber como me tornar membro ${chosen}.`;
}

/** Mensagem do WhatsApp com o formulário preenchido; campos vazios não aparecem. */
export function memberMessage(p: MemberProfile) {
  const place = [p.city, p.state, p.country].filter(Boolean).join(", ");
  const birth = p.birthDate ? p.birthDate.split("-").reverse().join("/") : "";
  const rows: [string, string | undefined][] = [
    ["Nome", [p.title, p.givenName, p.familyName].filter(Boolean).join(" ")],
    ["E-mail", p.email],
    ["Telefone", p.phone],
    ["Endereço", [p.address, p.addressLine2, p.postalCode && `CEP ${p.postalCode}`].filter(Boolean).join(", ")],
    ["Cidade", place],
    ["Sou", label(JEWISH_STATUS, p.jewishStatus)],
    ["Sexo", label(SEXES, p.sex)],
    ["Nascimento", birth],
    ["Horários de Shabat", p.shabbatCity ? findCity(p.shabbatCity).name : undefined],
    ["Categoria", label(MEMBERSHIP_TIERS, p.tier)],
  ];
  const lines = rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`);
  return [memberGreeting(p.tier), "", "Meu cadastro:", ...lines].join("\n");
}

export function memberWhatsAppUrl(whatsappUrl: string, p: MemberProfile) {
  return `${whatsappUrl}?text=${encodeURIComponent(memberMessage(p))}`;
}
