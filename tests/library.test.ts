import { expect, it } from "vitest";
import { works } from "@/content/tanakh-works";
import { workName, worksFor, workUrl } from "@/domain/tanakh-work";
import { toOutline } from "@/domain/work-outline";

it("traduz nomes de obras", () => {
  expect(workName("Rashi on Genesis")).toBe("Rashi sobre Bereshit");
  expect(workName("Onkelos Genesis")).toBe("Onkelos Bereshit");
  expect(workName("Radak on I Samuel")).toBe("Radak sobre Shmuel I");
});

it("associa comentários ao livro certo", () => {
  const titles = worksFor("I Samuel", works).map((w) => w.title);
  expect(titles).toContain("Rashi on I Samuel");
  expect(titles).not.toContain("Rashi on II Samuel");
});

it("monta o sumário de obras simples e aninhadas", () => {
  expect(toOutline([{ title: "A", heTitle: "א", chapters: [[1, 0], [0, 0], 3] }])).toEqual([{ title: "A", hebrew: "א", chapters: [1, 3] }]);
  expect(
    toOutline([{ title: "B", heTitle: "ב", isComplex: true, chapters: [{ title: "B, Intro", heTitle: "ה", chapters: 2 }, { title: "B, X", heTitle: "ו", chapters: [0, 4] }] }]),
  ).toEqual([{ title: "B, Intro", hebrew: "ה", chapters: null }, { title: "B, X", hebrew: "ו", chapters: [2] }]);
});

it("codifica o título na URL", () => expect(workUrl("Rashi on Genesis", 2)).toBe("/biblioteca/obra?t=Rashi+on+Genesis&c=2"));
