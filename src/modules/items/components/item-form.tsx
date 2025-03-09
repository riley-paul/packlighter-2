import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { initItem } from "@/lib/init";
import { Button, Select, Text, TextField } from "@radix-ui/themes";
import { useAtomValue, useSetAtom } from "jotai";
import { closeEditorAtom, editorItemAtom } from "../store";
import useItemsMutations from "../mutations";
import { weightUnitsInfo, type ItemInsert } from "@/db/schema";
import ItemFormImage from "./item-form-image";

const ItemForm: React.FC = () => {
  const item = useAtomValue(editorItemAtom);
  const closeEditor = useSetAtom(closeEditorAtom);

  const methods = useForm<ItemInsert>({
    defaultValues: initItem(item),
    resolver: zodResolver(z.custom<ItemInsert>()),
  });

  const { control, handleSubmit } = methods;
  const { updateItem, addItem } = useItemsMutations();

  const onSubmit = handleSubmit((data) => {
    item
      ? updateItem.mutate({ itemId: item.id, data })
      : addItem.mutate({ data });
    closeEditor();
  });

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
                        <Select.Trigger variant="ghost" placeholder="Unit" />
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

        <ItemFormImage />

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
