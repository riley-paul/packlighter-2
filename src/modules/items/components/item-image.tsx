import React from "react";
import { cn } from "@/lib/utils";
import type { ItemSelect } from "@/db/schema";

type ImageInfo = Pick<ItemSelect, "imageS3" | "imageType" | "imageUrl">;

const getImageUrl = ({ imageS3, imageType, imageUrl }: ImageInfo) => {
  if (imageType === "upload") return imageS3;
  if (imageType === "url") return imageUrl;
  return "";
};

interface Props {
  item: ImageInfo;
  size?: "lg" | "sm";
  className?: string;
}

const NoImage: React.FC<Props> = (props) => {
  const { size = "sm" } = props;
  if (size === "sm") return null;
  return "No Image";
};

const ItemImage: React.FC<Props> = (props) => {
  const { item, size = "sm", className } = props;
  const url = getImageUrl(item);

  return (
    <div
      className={cn(
        "flex h-full shrink-0 items-center justify-center text-gray-10",
        url ? "bg-[white]" : "bg-gray-4",
        size === "lg" ? "rounded-3 p-2" : "rounded-2 p-0.5",
        className,
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
