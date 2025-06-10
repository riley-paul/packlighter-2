import type { ItemForm } from "@/lib/types";
import {
  Button,
  Card,
  IconButton,
  Kbd,
  Tabs,
  Text,
  TextField,
} from "@radix-ui/themes";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import ItemImage, { ItemImageContext } from "./item-image";
import useImageDropzone from "@/hooks/use-image-dropzone";
import { cn, getItemImageUrl } from "@/lib/client/utils";

const ImageWithRemoveButton: React.FC<{
  imageUrl: string | undefined;
  handleRemove: () => void;
  shouldRender?: boolean;
}> = ({ imageUrl, handleRemove, shouldRender }) => {
  if (!shouldRender) {
    return null;
  }

  return (
    <div className="relative">
      <ItemImage openImage imageUrl={imageUrl} />
      <IconButton
        className="absolute -right-8 top-0"
        color="red"
        radius="full"
        variant="soft"
        size="1"
        onClick={handleRemove}
      >
        <i className="fas fa-xmark" />
      </IconButton>
    </div>
  );
};

const getContainerStyle = (size: "sm" | "md" | "lg" | null | undefined) => ({
  "h-16": size === "sm",
  "h-24": size === "md",
  "h-40": size === "lg",
});

const UrlImageInput: React.FC = () => {
  const { control } = useFormContext<ItemForm>();
  const { size } = React.useContext(ItemImageContext);

  return (
    <Controller
      control={control}
      name="image"
      render={({ field }) => (
        <Card className="flex gap-4">
          <ImageWithRemoveButton
            imageUrl={field.value ?? undefined}
            handleRemove={() => field.onChange(null)}
            shouldRender={Boolean(field.value)}
          />
          <section
            className={cn(
              "flex w-full flex-col justify-center gap-2",
              getContainerStyle(size),
              !Boolean(field.value) && "px-10",
            )}
          >
            <TextField.Root
              {...field}
              className="w-full"
              value={field.value ?? ""}
              type="url"
              placeholder="https://example.com/cool-picture-of-boots"
            />
          </section>
        </Card>
      )}
    />
  );
};

const UploadImageInput: React.FC = () => {
  const { control, watch, setValue } = useFormContext<ItemForm>();
  const hasUploadedImage = Boolean(watch("imageR2Key"));

  const { size } = React.useContext(ItemImageContext);

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
            className={cn("flex transition-colors ease-out", {
              "bg-gray-4": state === "over",
              "bg-gray-3": state === "potential",
            })}
          >
            <HiddenInput />
            <ImageWithRemoveButton
              imageUrl={
                field.value
                  ? URL.createObjectURL(field.value)
                  : getItemImageUrl(watch())
              }
              handleRemove={() => {
                field.onChange(undefined);
                setValue("imageR2Key", null);
                setValue("removeImageFile", true);
              }}
              shouldRender={Boolean(field.value) || hasUploadedImage}
            />
            <section
              className={cn(
                "flex w-full flex-col items-center justify-center gap-2",
                getContainerStyle(size),
                !Boolean(field.value) && !hasUploadedImage && "px-10",
              )}
            >
              <Button
                variant="soft"
                type="button"
                onClick={() => onInputTriggerClick()}
              >
                <i className="fas fa-image"></i>
                Select Image
              </Button>
              <Text size="1" color="gray" className="text-center leading-2">
                Drag and drop an image here, click to select, or paste from
                clipboard using <Kbd>Ctrl+V</Kbd>
              </Text>
            </section>
          </Card>
        );
      }}
    />
  );
};

const ItemFormImageInput: React.FC = () => {
  const { control } = useFormContext<ItemForm>();

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
