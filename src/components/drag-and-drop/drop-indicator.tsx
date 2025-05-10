import { cn } from "@/lib/client/utils";
import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";
import type { CSSProperties, HTMLAttributes } from "react";

type Orientation = "horizontal" | "vertical";

const edgeToOrientationMap: Record<Edge, Orientation> = {
  top: "horizontal",
  bottom: "horizontal",
  left: "vertical",
  right: "vertical",
};

const orientationStyles: Record<
  Orientation,
  HTMLAttributes<HTMLElement>["className"]
> = {
  horizontal:
    "h-[--line-thickness] left-[--terminal-radius] right-0 before:left-[--negative-terminal-size]",
  vertical:
    "w-[--line-thickness] top-[--terminal-radius] bottom-0 before:top-[--negative-terminal-size]",
};

const edgeStyles: Record<Edge, HTMLAttributes<HTMLElement>["className"]> = {
  top: "top-[--line-offset] before:top-[--offset-terminal]",
  right: "right-[--line-offset] before:right-[--offset-terminal]",
  bottom: "bottom-[--line-offset] before:bottom-[--offset-terminal]",
  left: "left-[--line-offset] before:left-[--offset-terminal]",
};

const strokeSize = 2;
const terminalSize = 8;
const offsetToAlignTerminalWithLine = (strokeSize - terminalSize) / 2;

/**
 * This is a tailwind port of `@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box`
 */

interface Props {
  edge: Edge;
  gap: string;
  className?: string;
}

export const DropIndicator: React.FC<Props> = ({ edge, gap, className }) => {
  const lineOffset = `calc(-0.5 * (${gap} + ${strokeSize}px))`;

  const orientation = edgeToOrientationMap[edge];

  return (
    <div
      style={
        {
          "--line-thickness": `${strokeSize}px`,
          "--line-offset": `${lineOffset}`,
          "--terminal-size": `${terminalSize}px`,
          "--terminal-radius": `${terminalSize / 2}px`,
          "--negative-terminal-size": `-${terminalSize}px`,
          "--offset-terminal": `${offsetToAlignTerminalWithLine}px`,
        } as CSSProperties
      }
      className={cn(
        "pointer-events-none absolute z-50 box-border bg-accent-10 before:absolute before:h-[--terminal-size] before:w-[--terminal-size] before:rounded-full before:border-[length:--line-thickness] before:border-solid before:border-accent-10 before:content-['']",
        orientationStyles[orientation],
        [edgeStyles[edge]],
        className,
      )}
    ></div>
  );
};
