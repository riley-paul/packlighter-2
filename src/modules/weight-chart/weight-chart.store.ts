import { type DatumId } from "@nivo/pie";
import { atom } from "jotai";

export const activeCategoryIdAtom = atom<DatumId | null>(null);
