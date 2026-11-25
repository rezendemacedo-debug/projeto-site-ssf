import { PixPayload } from "@/domain/pix";

/** true na versão estática (GitHub Pages), sem login nem formulários. */
export const IS_STATIC = process.env.NEXT_PUBLIC_STATIC === "1";
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const SITE = {
  name: "Sinagoga Sem Fronteiras",
  url: process.env.SITE_URL ?? "http://localhost:3000",
  description: "Aulas de Torá com o Rabino Ventura, estudo de hebraico, textos sagrados e horários haláchicos.",
  whatsapp: { label: "+55 11 93006-9900", url: "https://wa.me/5511930069900" },
  pixKey: "sinagogasemfronteiras@gmail.com",
};

export const PIX = new PixPayload(SITE.pixKey, SITE.name, "Sao Paulo");

export const SOCIAL = [
  { name: "Instagram", handle: "@rabinoventura", url: "https://www.instagram.com/rabinoventura/" },
  { name: "YouTube", handle: "@sinagogasemfronteiras", url: "https://www.youtube.com/@sinagogasemfronteiras" },
  { name: "TikTok", handle: "@rabinoventura", url: "https://www.tiktok.com/@rabinoventura" },
];

export const NAV = [
  { href: "/aulas", label: "Aulas" },
  { href: "/parasha", label: "Parashá" },
  { href: "/biblioteca", label: "Biblioteca" },
  { href: "/hebraico", label: "Hebraico" },
  { href: "/calendario", label: "Calendário" },
  { href: "/kotel", label: "Kotel ao vivo" },
  { href: "/sobre", label: "A sinagoga" },
];

export const FOOTER = [
  { title: "Estudo", links: [["/aulas", "Aulas em vídeo"], ["/cursos", "Cursos"], ["/parasha", "Parashá da semana"], ["/biblioteca", "Biblioteca"], ["/hebraico", "Aprender hebraico"], ["/dicionario", "Dicionário"]] },
  { title: "Vida judaica", links: [["/judaismo-diario", "Judaísmo diário"], ["/calendario", "Calendário e zmanim"], ["/kotel", "Kotel ao vivo"], ["/cabala", "Cabalá"], ["/bnei-anussim", "Bnei Anussim"]] },
  { title: "Sinagoga", links: [["/sobre", "Sobre nós"], ["/rabino-ventura", "Rabino Ventura"], ["/missao", "Missão e pilares"], ...(IS_STATIC ? [] : [["/membros", "Área de membros"] as const]), ["/seja-membro", "Seja membro"]] },
  { title: "Apoio", links: [["/doar", "Doar"], ["/contato", "Contato"], ["/privacidade", "Privacidade"]] },
] as const;
