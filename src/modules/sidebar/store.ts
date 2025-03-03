import { atomWithStorage } from "jotai/utils";
import { FilterOptions, SortOptions } from "./types";
import { atom } from "jotai";

export const sortOptionAtom = atomWithStorage<SortOptions>(
  "items-sorting",
  SortOptions.CreatedAt,
);
export const filterOptionsAtom = atomWithStorage<
  Record<FilterOptions, boolean>
>("items-filter", { [FilterOptions.NotInList]: false });

export const searchStringAtom = atom<string>("");

export const mobileSidebarOpenAtom = atomWithStorage<boolean>(
  "mobileSidebarOpen",
  false,
);
export const desktopSidebarOpenAtom = atomWithStorage<boolean>(
  "desktopSidebarOpen",
  false,
);
