import { type ItemInsert } from "@/db/schema";
import { Button, Card, Heading, Tabs, Text, TextField } from "@radix-ui/themes";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import ItemImage from "./item-image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";

const FileDropzone: React.FC<{ onFile: (file: File) => void }> = ({
  onFile,
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

    const [file] = Array.from(e.dataTransfer.files);
    if (file) onFile(file);
  };

  const handleFileSelect: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const [file] = Array.from(e.target.files ?? []);
    if (file) onFile(file);
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
  const { watch, setValue, control } = useFormContext<ItemInsert>();
  const imageUrl = watch("imageUrl");
  const s3ImageUrl = watch("imageS3");

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return fetch("/upload-to-s3", {
        method: "POST",
        body: formData,
      }).then((res) => res.json());
    },
  });

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
        <Tabs.Content value="upload" className="grid gap-3">
          <section className="flex gap-3">
            <div className="size-24 shrink-0">
              <ItemImage url={s3ImageUrl} />
            </div>
            <FileDropzone
              onFile={async (file) => {
                const result = await uploadImageMutation.mutateAsync(file);
                setValue("imageS3", result.imageUrl);
                console.log(result);
              }}
            />
          </section>
          {s3ImageUrl && (
            <Button
              type="button"
              variant="soft"
              color="red"
              onClick={() => setValue("imageS3", null)}
            >
              Remove Image
            </Button>
          )}
        </Tabs.Content>
        <Tabs.Content value="url" className="grid gap-3">
          <section className="flex gap-3">
            <div className="size-24 shrink-0">
              <ItemImage url={imageUrl} />
            </div>
            <Controller
              control={control}
              name="imageUrl"
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
          {imageUrl && (
            <Button
              type="button"
              variant="soft"
              color="red"
              onClick={() => setValue("imageUrl", null)}
            >
              Remove Image
            </Button>
          )}
        </Tabs.Content>
      </Tabs.Root>
    </Card>
  );
};

export default ItemFormImage;
