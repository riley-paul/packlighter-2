import React from "react";
import { cn } from "@/lib/client/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Text } from "@radix-ui/themes";

const itemImageVariants = cva(
  "flex shrink-0 items-center justify-center text-gray-10 min-h-4",
  {
    variants: {
      size: {
        sm: "rounded-2 p-0.5 size-16",
        md: "rounded-2 p-1 size-24",
        lg: "rounded-3 p-2 size-40",
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
  openImage?: boolean;
} & VariantProps<typeof itemImageVariants> &
  React.HTMLAttributes<HTMLDivElement>;

export const ItemImageContext = React.createContext<
  VariantProps<typeof itemImageVariants>
>({ size: "sm" });

const ItemImage = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const context = React.useContext(ItemImageContext);
  const { imageUrl, size, className, openImage } = Object.assign(
    context,
    props,
  );
  const [imageError, setImageError] = React.useState(false);

  const content = () => (
    <div
      ref={ref}
      className={cn(
        itemImageVariants({ size, hasImage: Boolean(imageUrl), className }),
      )}
    >
      {imageUrl && !imageError ? (
        <img
          src={imageUrl}
          onError={() => setImageError(true)}
          className="h-full w-full object-contain"
        />
      ) : (
        size === "lg" && (
          <Text size="1" color="gray">
            No Image
          </Text>
        )
      )}
    </div>
  );

  if (openImage && imageUrl) {
    return (
      <a href={imageUrl} target="_blank" rel="noopener noreferrer">
        {content()}
      </a>
    );
  }
  return content();
});

export default ItemImage;
