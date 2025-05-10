import { atomWithStorage } from "jotai/utils";
import type { Theme } from "./theme.types";

export const themeAtom = atomWithStorage<Theme>("theme", "system");
