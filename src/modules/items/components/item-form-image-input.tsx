import type { ItemInsert } from "@/lib/types";
import { Tabs } from "@radix-ui/themes";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

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
          <Tabs.List size="1">
            <Tabs.Trigger value="file">Upload</Tabs.Trigger>
            <Tabs.Trigger value="url">URL</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="file">File</Tabs.Content>
          <Tabs.Content value="url">URL</Tabs.Content>
        </Tabs.Root>
      )}
    />
  );
};

export default ItemFormImageInput;
