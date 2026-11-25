import catalog from "../../data/tanakh.json";
import type { TanakhWork } from "@/domain/tanakh-work";
import { EDITORIAL_POLICY } from "./editorial-policy";

export const works: TanakhWork[] = catalog;

/** false: a obra só aparece com link para o Sefaria. */
export function isReadable(work: TanakhWork) {
  return !EDITORIAL_POLICY.linkOnlyLibraryGroups.includes(work.path[0]!);
}
