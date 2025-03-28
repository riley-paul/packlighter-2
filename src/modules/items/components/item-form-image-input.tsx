import type { ItemInsert } from "@/lib/types";
import { Button, Card, Tabs, TextField } from "@radix-ui/themes";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import ItemImage from "./item-image";

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
              onClick={() => field.onChange("")}
              disabled={field.value?.length === 0}
            >
              Remove
            </Button>
          </section>
        </Card>
      )}
    />
  );
};

const UploadImageInput: React.FC = () => {
  const { control } = useFormContext<ItemInsert>();
  return (
    <Controller
      control={control}
      name="imageR2Key"
      render={({ field }) => (
        <Card>
          <ItemImage imageUrl="" />
        </Card>
      )}
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
