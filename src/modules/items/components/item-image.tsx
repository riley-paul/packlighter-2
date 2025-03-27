import React from "react";
import { cn } from "@/lib/client/utils";
import { cva, type VariantProps } from "class-variance-authority";

const imageVariants = cva(
  "flex shrink-0 items-center justify-center text-gray-10 min-h-4",
  {
    variants: {
      size: {
        sm: "rounded-2 p-0.5 size-16",
        lg: "rounded-3 p-2 size-32",
      },
      hasImage: {
        true: "bg-[white]",
        false: "bg-gray-4",
      },
    },
    defaultVariants: {
      size: "sm",
      hasImage: false,
    },
  },
);

type Props = {
  imageUrl: string | undefined;
} & VariantProps<typeof imageVariants> &
  React.HTMLAttributes<HTMLDivElement>;

const ItemImage = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { imageUrl, size, className } = props;

  return (
    <div
      ref={ref}
      className={cn(
        imageVariants({ size, hasImage: Boolean(imageUrl), className }),
      )}
    >
      {imageUrl ? (
        <img src={imageUrl} className="h-full w-full object-contain" />
      ) : (
        size === "lg" && "No Image"
      )}
    </div>
  );
});

export default ItemImage;
