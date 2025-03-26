import React from "react";

import { cn } from "@/lib/client/utils";
import ItemImage from "./item-image";
import ResponsiveModal from "@/components/base/responsive-modal";
import { Button, Heading, Tabs, Text, TextField } from "@radix-ui/themes";
import useItemsMutations from "../mutations";
import { zItemInsert, type ItemSelect } from "@/lib/types";
import { Controller, FormProvider, useForm } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
  item: ItemSelect;
}

const schema = zItemInsert.pick({
  image: true,
  imageType: true,
  imageUploaded: true,
});

type Schema = z.infer<typeof schema>;

const ItemImageDialog: React.FC<Props> = (props) => {
  const { item } = props;

  const [isOpen, setIsOpen] = React.useState(false);
  const { updateItem } = useItemsMutations();

  const methods = useForm<Schema>({
    resolver: zodResolver(schema),
    values: item,
  });

  const { handleSubmit, control, watch } = methods;

  const imageUrl =
    watch("imageType") === "url" ? watch("image") : watch("imageUploaded");

  const onSubmit = handleSubmit((data) => {
    updateItem.mutate({ itemId: item.id, data });
    setIsOpen(false);
  });

  return (
    <>
      <button
        className="flex h-full"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <ItemImage
          url={item.image}
          size="sm"
          className={cn(
            "w-16",
            item.image ? "h-16" : "h-full min-h-6 bg-gray-4",
            "outline-primary outline-1 outline-offset-1 transition-all hover:outline",
          )}
        />
      </button>
      <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
        <header>
          <Heading size="3">Update {item.name} Image</Heading>
          <Text size="2" color="gray">
            Either upload an image or provide an image URL
          </Text>
        </header>
        <FormProvider {...methods}>
          <form id="image-form" onSubmit={onSubmit} className="grid gap-4">
            <Controller
              control={control}
              name="imageType"
              render={({ field }) => (
                <Tabs.Root
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid gap-2"
                >
                  <Tabs.List>
                    <Tabs.Trigger value="file">Upload</Tabs.Trigger>
                    <Tabs.Trigger value="url">URL</Tabs.Trigger>
                  </Tabs.List>
                  <Tabs.Content value="file">File upload</Tabs.Content>
                  <Tabs.Content value="url">
                    <Controller
                      control={control}
                      name="image"
                      render={({ field }) => (
                        <TextField.Root
                          type="url"
                          placeholder="Image Url"
                          {...field}
                          value={field.value ?? undefined}
                        >
                          <TextField.Slot>
                            <i className="fa-solid fa-link" />
                          </TextField.Slot>
                        </TextField.Root>
                      )}
                    />
                  </Tabs.Content>
                </Tabs.Root>
              )}
            />

            <ItemImage url={imageUrl} size="lg" className="aspect-square" />

            <div className="grid gap-2 sm:flex sm:justify-end">
              {/* <Button
                type="button"
                variant="soft"
                color="red"
                disabled={updateItem.isPending}
                onClick={() => {
                  setValue("");
                  updateItem.mutate({ itemId: item.id, data: { image: null } });
                  setIsOpen(false);
                }}
              >
                <i className="fa-solid fa-trash" />
                Delete Image
              </Button> */}
              <Button
                type="submit"
                form="image-form"
                disabled={updateItem.isPending}
              >
                <i className="fa-solid fa-save" />
                Save
              </Button>
            </div>
            <input type="hidden" />
          </form>
        </FormProvider>
      </ResponsiveModal>
    </>
  );
};

export default ItemImageDialog;
