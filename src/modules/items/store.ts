import type { ItemSelect } from "@/lib/types";
import { atom } from "jotai";

export const editorItemAtom = atom<ItemSelect | undefined>(undefined);
export const editorOpenAtom = atom(false);

export const openEditorAtom = atom(null, (_get, set, item?: ItemSelect) => {
  set(editorItemAtom, item);
  set(editorOpenAtom, true);
});

export const closeEditorAtom = atom(null, (_get, set) => {
  set(editorItemAtom, undefined);
  set(editorOpenAtom, false);
});
