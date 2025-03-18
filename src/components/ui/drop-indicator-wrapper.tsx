import type { DraggableState } from "@/hooks/use-draggable-state";
import React from "react";
import { DropIndicator } from "./drop-indicator";
import { cn } from "@/lib/client/utils";

type Props = React.PropsWithChildren<{
  draggableState: DraggableState;
  gap?: string;
}>;

const DropIndicatorWrapper: React.FC<Props> = ({
  children,
  draggableState,
  gap = "0px",
}) => {
  return (
    <div
      className={cn(
        "relative transition-opacity duration-300 ease-out",
        draggableState.type === "is-dragging" && "opacity-50",
      )}
    >
      {children}
      {draggableState.type === "is-dragging-over" &&
        draggableState.closestEdge && (
          <DropIndicator edge={draggableState.closestEdge} gap={gap} />
        )}
    </div>
  );
};

export default DropIndicatorWrapper;
