import type { ItemInsert, ItemInsertWithFile } from "@/lib/types";
import { Button, Card, Tabs, TextField } from "@radix-ui/themes";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import ItemImage from "./item-image";
import useImageDropzone from "@/hooks/use-image-dropzone";
import { cn } from "@/lib/client/utils";

const UrlImageInput: React.FC = () => {
  const { control } = useFormContext<ItemInsert>();
  return (
    <Controller
      control={control}
      name="image"
      render={({ field }) => (
        <Card className="flex gap-4">
          <ItemImage imageUrl={field.value ?? undefined} />
          <section className="flex w-full flex-col justify-between">
            <TextField.Root
              {...field}
              value={field.value ?? ""}
              type="url"
              placeholder="https://example.com/cool-picture-of-boots"
            />
            <Button
              type="button"
              variant="soft"
              size="1"
              color="red"
              className="gap-2"
              onClick={() => field.onChange("")}
              disabled={field.value?.length === 0}
            >
              <i className="fas fa-trash"></i>
              Remove
            </Button>
          </section>
        </Card>
      )}
    />
  );
};

const UploadImageInput: React.FC = () => {
  const { control } = useFormContext<ItemInsertWithFile>();
  return (
    <Controller
      control={control}
      name="imageFile"
      render={({ field }) => {
        const { ref, state, onInputTriggerClick, HiddenInput } =
          useImageDropzone({
            handleUpload: (file) => field.onChange(file),
          });

        return (
          <Card
            ref={ref}
            className={cn("flex", {
              "border-red-5": state === "over",
            })}
          >
            <HiddenInput />
            {field.value ? (
              <>
                <ItemImage imageUrl={URL.createObjectURL(field.value)} />
                <div className="flex w-full items-center justify-center">
                  <Button
                    variant="soft"
                    type="button"
                    color="red"
                    className="gap-2"
                    onClick={() => field.onChange(null)}
                  >
                    <i className="fas fa-trash"></i>
                    Remove
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex min-h-16 w-full items-center justify-center">
                <Button
                  variant="soft"
                  type="button"
                  onClick={() => onInputTriggerClick()}
                >
                  <i className="fas fa-image"></i>
                  Select Image
                </Button>
              </div>
            )}
          </Card>
        );
      }}
    />
  );
};

const ItemFormImageInput: React.FC = () => {
  const { control } = useFormContext<ItemInsert>();

  return (
    <Controller
      control={control}
      name="imageType"
      render={({ field }) => (
        <Tabs.Root
          value={field.value}
          onValueChange={(value) => field.onChange(value)}
        >
          <Tabs.List size="1" className="mx-3 -mb-px">
            <Tabs.Trigger value="file">Upload</Tabs.Trigger>
            <Tabs.Trigger value="url">URL</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="file">
            <UploadImageInput />
          </Tabs.Content>
          <Tabs.Content value="url">
            <UrlImageInput />
          </Tabs.Content>
        </Tabs.Root>
      )}
    />
  );
};

export default ItemFormImageInput;
