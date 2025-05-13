import { cn } from "@/lib/client/utils";
import { GripVertical } from "lucide-react";
import React from "react";

type Props = {
  isGrabbing?: boolean;
  disabled?: boolean;
};

const Gripper = React.forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { isGrabbing, disabled, ...rest } = props;

  return (
    <button
      ref={ref}
      {...(disabled ? { disabled: true } : rest)}
      className={cn(
        "flex cursor-grab items-center justify-center text-gray-10 transition-colors hover:text-gray-12",
        isGrabbing && "cursor-grabbing",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <GripVertical size="1rem" />
    </button>
  );
});

export default Gripper;
