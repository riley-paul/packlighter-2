import { atomWithStorage } from "jotai/utils";
import type { Theme } from "./types";

export const themeAtom = atomWithStorage<Theme>("theme", "system");
