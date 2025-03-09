import { type ItemInsert } from "@/db/schema";
import {
  Button,
  Card,
  Heading,
  Tabs,
  Text,
  TextField,
} from "@radix-ui/themes";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import ItemImage from "./item-image";
import { useState } from "react";
import { cn } from "@/lib/utils";

const FileDropzone: React.FC<{ onFiles: (files: File[]) => void }> = ({
  onFiles,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver: React.DragEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave: React.DragEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop: React.DragEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length) {
      onFiles(files);
    }
  };

  const handleFileSelect: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) {
      onFiles(files);
    }
  };

  return (
    <div
      className={cn(
        "flex w-full cursor-pointer items-center justify-center rounded-2 border-2 border-dashed",
        isDragging ? "border-accent-6 bg-accent-2" : "border-gray-6 bg-gray-3",
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        multiple
        className="hidden"
        id="fileInput"
        onChange={handleFileSelect}
      />
      <Text
        as="label"
        htmlFor="fileInput"
        className="block"
        size="2"
        color="gray"
      >
        {isDragging
          ? "Drop the files here!"
          : "Drag files here or click to upload"}
      </Text>
    </div>
  );
};

const ItemFormImage: React.FC = ({}) => {
  const { watch, resetField, control } = useFormContext<ItemInsert>();
  const imageUrl = watch("image");

  return (
    <Card size="2" className="grid gap-3">
      <header>
        <Heading as="h3" size="2">
          Item Image
        </Heading>
        <Text size="2" color="gray">
          Upload an image or provide a URL
        </Text>
      </header>
      <Tabs.Root defaultValue="upload" className="grid gap-3">
        <Tabs.List size="1">
          <Tabs.Trigger value="upload">Upload</Tabs.Trigger>
          <Tabs.Trigger value="url">URL</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="upload">
          <section className="flex gap-3">
            <div className="size-24 shrink-0">
              <ItemImage url={imageUrl} />
            </div>
            <FileDropzone onFiles={() => {}} />
          </section>
        </Tabs.Content>
        <Tabs.Content value="url">
          <section className="flex gap-3">
            <div className="size-24 shrink-0">
              <ItemImage url={imageUrl} />
            </div>
            <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <Text
                  as="label"
                  size="1"
                  weight="medium"
                  className="grid h-min flex-1 gap-2"
                >
                  Image URL
                  <TextField.Root
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    {...field}
                    value={field.value || ""}
                  />
                </Text>
              )}
            />
          </section>
        </Tabs.Content>
      </Tabs.Root>
      {imageUrl && (
        <Button
          type="button"
          variant="soft"
          color="red"
          size="1"
          onClick={() => resetField("image")}
        >
          Remove Image
        </Button>
      )}
    </Card>
  );
};

export default ItemFormImage;
