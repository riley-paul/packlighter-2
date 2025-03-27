import useImageDropzone from "@/hooks/use-image-dropzone";
import type { ItemSelect } from "@/lib/types";
import React from "react";
import useItemsMutations from "../mutations";
import ItemImage from "./item-image";
import { cn } from "@/lib/client/utils";

type Props = {
  item: ItemSelect;
  className?: string;
};

const ItemImageDroppable: React.FC<Props> = ({ item, className }) => {
  const { updateItem } = useItemsMutations();

  const { ref, state } = useImageDropzone({
    handleUpload: (file) => {
      updateItem.mutate({
        itemId: item.id,
        data: { imageUploadedFile: file },
      });
    },
  });

  return (
    <ItemImage
      ref={ref}
      item={item}
      className={cn(className, "border", {
        "border-gray-7": state === "idle",
        "border-gray-8": state === "potential",
        "border-gray-9 bg-gray-5": state === "over",
      })}
    />
  );
};

export default ItemImageDroppable;
