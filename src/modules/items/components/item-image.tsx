import React from "react";
import { cn } from "@/lib/client/utils";
import { cva, type VariantProps } from "class-variance-authority";

const imageVariants = cva(
  "flex shrink-0 items-center justify-center text-gray-10",
  {
    variants: {
      size: {
        sm: "rounded-2 p-0.5",
        lg: "rounded-3 p-2",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  },
);

type Props = {
  url: string | undefined | null;
} & VariantProps<typeof imageVariants> &
  React.HTMLAttributes<HTMLDivElement>;

const NoImage: React.FC<Props> = (props) => {
  const { size } = props;
  if (size === "sm") return null;
  return "No Image";
};

const ItemImage: React.FC<Props> = (props) => {
  const { url, size, className } = props;

  return (
    <div
      className={cn(
        imageVariants({ size, className }),
        url ? "bg-[white]" : "bg-gray-4",
      )}
    >
      {url ? (
        <img src={url} className="h-full w-full object-contain" />
      ) : (
        <NoImage {...props} />
      )}
    </div>
  );
};

export default ItemImage;
