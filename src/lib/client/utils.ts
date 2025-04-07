import type { DragLocationHistory } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ItemSelect } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatWeight = (value: number): string => {
  if (value < 10) return (Math.round(value * 100) / 100).toLocaleString("en");
  if (value < 100) return (Math.round(value * 10) / 10).toLocaleString("en");
  return Math.round(value).toLocaleString("en");
};

export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const getCheckboxState = (values: boolean[]): CheckedState => {
  if (values.length === 0) return false;
  if (values.every((v) => v)) return true;
  if (values.some((v) => v)) return "indeterminate";
  return false;
};

export const getIsTyping = () =>
  document.activeElement?.tagName === "INPUT" ||
  document.activeElement?.tagName === "TEXTAREA" ||
  // @ts-expect-error
  document.activeElement?.isContentEditable;

export const getHasModifier = (event: KeyboardEvent) =>
  event.ctrlKey || event.metaKey || event.altKey || event.shiftKey;

export const triggerElementFlash = (element: HTMLElement) => {
  element.animate(
    [
      { backgroundColor: "rgba(120,120,120,0.5)" },
      { backgroundColor: "transparent" },
    ],
    {
      duration: 1000,
      easing: "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
      iterations: 1,
    },
  );
};

export const triggerElementFlashByDragId = (dragId: string) => {
  const element = document.querySelector(`[data-drag-id="${dragId}"]`);
  if (element instanceof HTMLElement) triggerElementFlash(element);
};

export const centerDragPreviewOnMouse = (
  location: DragLocationHistory,
  element: HTMLElement,
) => {
  const { clientX, clientY } = location.initial.input;
  const { top, left } = element.getBoundingClientRect();

  const topOffset = clientY - top;
  const leftOffset = clientX - left;

  return () => ({ x: leftOffset, y: topOffset });
};

export const getItemImageUrl = (
  item: Partial<Pick<ItemSelect, "image" | "imageR2Key" | "imageType">>,
): string | undefined => {
  if (item.imageType === "url") {
    if (!item.image) return undefined;
    return item.image;
  }

  if (!item.imageR2Key) return undefined;
  return `/media/${item.imageR2Key}.jpg`;
};

export function toFormData(obj: Record<string, any>): FormData {
  const formData = new FormData();
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      formData.append(key, obj[key]);
    }
  }
  return formData;
}
