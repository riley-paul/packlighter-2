import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Select, Text, TextField } from "@radix-ui/themes";
import { useAtomValue, useSetAtom } from "jotai";
import { closeEditorAtom, editorItemAtom } from "../store";
import useItemsMutations from "../mutations";
import { weightUnitsInfo } from "@/lib/client/constants";
import ItemFormImageInput from "./item-form-image-input";
import { toast } from "sonner";
import { zItemInsert, type ItemInsert } from "@/lib/types";

const ItemForm: React.FC = () => {
  const item = useAtomValue(editorItemAtom);
  const closeEditor = useSetAtom(closeEditorAtom);

  const methods = useForm<ItemInsert>({
    values: item || {
      name: "",
      description: "",
      weight: 0,
      weightUnit: "g",
      imageType: "file",
    },
    resolver: zodResolver(zItemInsert),
  });

  const { control, handleSubmit } = methods;
  const { updateItem, addItem } = useItemsMutations();

  const onSubmit = handleSubmit(
    (data) => {
      item
        ? updateItem.mutate(
            { ...data, id: item.id },
            {
              onSuccess: () => {
                closeEditor();
                toast.success("Item updated");
              },
              onError: () => toast.error("Failed to update item"),
            },
          )
        : addItem.mutate(data, {
            onSuccess: () => {
              closeEditor();
              toast.success("Item added");
            },
            onError: () => toast.error("Failed to add item"),
          });
    },
    (errors) => {
      console.log(errors);
      toast.error(errors.description?.message || "Form errors");
    },
  );

  return (
    <FormProvider {...methods}>
      <form className="grid gap-4" onSubmit={onSubmit}>
        <input type="submit" hidden />
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <div className="grid gap-2">
              <Text as="label" size="2" weight="medium">
                Name
              </Text>
              <TextField.Root placeholder="Great piece of kit" {...field} />
            </div>
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <div className="grid gap-2">
              <Text as="label" size="2" weight="medium">
                Description
              </Text>
              <TextField.Root
                placeholder="Some marvellous and completely necessary piece of kit"
                {...field}
              />
            </div>
          )}
        />
        <Controller
          control={control}
          name="weight"
          render={({ field }) => (
            <div className="grid gap-2">
              <Text as="label" size="2" weight="medium">
                Weight
              </Text>
              <TextField.Root
                placeholder="Weight"
                type="number"
                step="0.001"
                min="0"
                onFocus={(e) => e.target.select()}
                {...field}
              >
                <TextField.Slot side="right">
                  <Controller
                    control={control}
                    name="weightUnit"
                    render={({ field }) => (
                      <Select.Root
                        size="1"
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <Select.Trigger variant="soft" placeholder="Unit" />
                        <Select.Content>
                          {weightUnitsInfo.map(({ symbol, name }) => (
                            <Select.Item key={symbol} value={symbol}>
                              {name}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                    )}
                  />
                </TextField.Slot>
              </TextField.Root>
            </div>
          )}
        />

        <div className="grid">
          <Text as="label" size="2" weight="medium">
            Image
          </Text>
          <ItemFormImageInput />
        </div>

        <div className="grid w-full gap-2 pt-8">
          <Button
            className="w-full"
            type="button"
            variant="soft"
            color="gray"
            onClick={closeEditor}
          >
            Cancel
          </Button>
          <Button type="submit">
            <i className="fa-solid fa-save" />
            Save
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ItemForm;
