import useImageDropzone from "@/hooks/use-image-dropzone";
import type { ItemSelect } from "@/lib/types";
import React from "react";
import useItemsMutations from "../mutations";
import ItemImage from "./item-image";
import { cn, getItemImageUrl } from "@/lib/client/utils";
import { toast } from "sonner";

type Props = {
  item: ItemSelect;
  className?: string;
};

const ItemImageDroppable: React.FC<Props> = ({ item, className }) => {
  const { updateItem } = useItemsMutations();

  const { ref, state } = useImageDropzone({
    handleUpload: (file) => {
      updateItem.mutate(
        {
          itemId: item.id,
          data: { imageType: "file" },
          itemImageFile: file,
        },
        {
          onSuccess: () => toast.success("Image uploaded successfully"),
          onError: () => toast.error("Failed to upload image"),
        },
      );
    },
  });

  const imageUrl = getItemImageUrl(item);

  return (
    <a href={imageUrl} target="_blank" rel="noreferrer">
      <ItemImage
        ref={ref}
        imageUrl={imageUrl}
        className={cn(className, "border", {
          "border-gray-7": state === "idle",
          "border-gray-8": state === "potential",
          "border-gray-9 bg-gray-5": state === "over",
        })}
      />
    </a>
  );
};

export default ItemImageDroppable;
