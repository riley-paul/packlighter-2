import React from "react";
import { cn } from "@/lib/client/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ItemSelect } from "@/lib/types";

const imageVariants = cva(
  "flex shrink-0 items-center justify-center text-gray-10 min-h-4",
  {
    variants: {
      size: {
        sm: "rounded-2 p-0.5",
        lg: "rounded-3 p-2",
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
  item: Partial<Pick<ItemSelect, "image" | "imageUploaded" | "imageType">>;
} & VariantProps<typeof imageVariants> &
  React.HTMLAttributes<HTMLDivElement>;

const NoImage: React.FC<Props> = (props) => {
  const { size } = props;
  if (size === "sm") return null;
  return "No Image";
};

const ItemImage: React.FC<Props> = (props) => {
  const { item, size, className } = props;
  const imageUrl = item.imageType === "url" ? item.image : item.imageUploaded;

  return (
    <div
      className={cn(
        imageVariants({ size, hasImage: Boolean(imageUrl), className }),
      )}
    >
      {imageUrl ? (
        <img src={imageUrl} className="h-full w-full object-contain" />
      ) : (
        <NoImage {...props} />
      )}
    </div>
  );
};

export default ItemImage;
