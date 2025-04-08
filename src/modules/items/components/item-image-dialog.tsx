import ResponsiveModal from "@/components/base/responsive-modal";
import {
  zItemImageForm,
  type ItemImageForm,
  type ItemSelect,
} from "@/lib/types";
import React from "react";
import ItemImage, { ItemImageContext } from "./item-image";
import { getItemImageUrl } from "@/lib/client/utils";
import { Button, Dialog } from "@radix-ui/themes";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ItemFormImageInput from "./item-form-image-input";
import useItemsMutations from "../mutations";
import { toast } from "sonner";

const ItemImageFormComponent: React.FC<{ item: ItemSelect }> = ({ item }) => {
  const { updateItem } = useItemsMutations();

  const methods = useForm<ItemImageForm>({
    values: {
      ...item,
      imageFile: undefined,
      removeImageFile: false,
    },
    resolver: zodResolver(zItemImageForm),
  });

  const { handleSubmit } = methods;
  const onSubmit = handleSubmit((data) => {
    updateItem.mutate(
      { ...data, id: item.id },
      {
        onSuccess: () => toast.success("Item image updated"),
        onError: () => toast.error("Failed to update item image"),
      },
    );
  });

  return (
    <FormProvider {...methods}>
      <form className="grid gap-4" onSubmit={onSubmit}>
        <ItemFormImageInput />
        <footer className="flex justify-end gap-2">
          <Button type="submit" variant="soft">
            Submit
          </Button>
        </footer>
      </form>
    </FormProvider>
  );
};

const ItemImageDialog: React.FC<{ item: ItemSelect }> = ({ item }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        <ItemImage imageUrl={getItemImageUrl(item)} />
      </button>
      <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
        <header>
          <Dialog.Title size="4" className="m-0">
            Update Item Image
          </Dialog.Title>
          <Dialog.Description size="2" color="gray">
            Either upload an image or provide a URL
          </Dialog.Description>
        </header>
        <ItemImageContext.Provider value={{ size: "lg" }}>
          <ItemImageFormComponent item={item} />
        </ItemImageContext.Provider>
      </ResponsiveModal>
    </>
  );
};

export default ItemImageDialog;
