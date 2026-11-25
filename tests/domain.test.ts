import { describe, expect, it } from "vitest";
import { formatDuration } from "@/domain/lesson";
import { classify, hasMeaningfulTitle } from "@/domain/lesson-classifier";
import { PARASHIOT } from "@/domain/parasha";
import { crc16, PixPayload } from "@/domain/pix";

describe("PIX", () => {
  it("usa CRC-16/CCITT-FALSE", () => expect(crc16("123456789")).toBe("29B1"));
  it("gera payload com valor e CRC coerente", () => {
    const p = new PixPayload("a@b.com", "São João", "São Paulo").build(18);
    expect(p).toContain("540518.00");
    expect(p).toContain("5908SAO JOAO");
    expect(crc16(p.slice(0, -4))).toBe(p.slice(-4));
  });
});

describe("classificação", () => {
  it.each([
    ["Eva - PECADORA? - Parashá Vayetsê - Judaísmo - Israel", "parasha"],
    ["AO VIVO - CONVERSÃO ao JUDAISMO - Rabino Ventura", "conversao"],
    ["Ética dos Pais - Se isolar faz mal", "talmud-e-sabios"],
    ["A origem judaica do sobrenome Goes", "bnei-anussim"],
    ["SHOFAR - O SEGREDO REVELADO", "festas"],
  ])("%s", (title, slug) => expect(classify(title)).toBe(slug));
  it("descarta títulos automáticos", () => {
    expect(hasMeaningfulTitle("3 de outubro de 2025")).toBe(false);
    expect(hasMeaningfulTitle("Rabino Ventura está ao vivo!")).toBe(false);
    expect(hasMeaningfulTitle("Cabalá e Ômer")).toBe(true);
  });
});

it("lista as 54 parashiot", () => expect(PARASHIOT).toHaveLength(54));
it("formata duração", () => expect(formatDuration(3661)).toBe("1:01:01"));
