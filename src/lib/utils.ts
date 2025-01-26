import type { CheckedState } from "@radix-ui/react-checkbox";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatWeight = (value: number): string => {
  if (value < 10) return (Math.round(value * 100) / 100).toLocaleString("en");
  if (value < 100) return (Math.round(value * 10) / 10).toLocaleString("en");
  return Math.round(value).toLocaleString("en");
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
  element.animate([{ backgroundColor: "var(--accent-11)" }, {}], {
    duration: 1000,
    easing: "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
    iterations: 1,
  });
};

export const triggerElementFlashByDragId = (dragId: string) => {
  const element = document.querySelector(`[data-drag-id="${dragId}"]`);
  if (element instanceof HTMLElement) triggerElementFlash(element);
};
