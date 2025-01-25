import React from "react";
import ItemForm from "./item-form";
import ResponsiveModal from "../base/responsive-modal";
import { Heading, Text } from "@radix-ui/themes";
import { useAtomValue, useSetAtom } from "jotai";
import {
  closeEditorAtom,
  editorItemAtom,
  editorOpenAtom,
  openEditorAtom,
} from "./store";

const ItemEditor: React.FC = () => {
  const item = useAtomValue(editorItemAtom);
  const isEditorOpen = useAtomValue(editorOpenAtom);
  const openEditor = useSetAtom(openEditorAtom);
  const closeEditor = useSetAtom(closeEditorAtom);

  return (
    <ResponsiveModal
      open={isEditorOpen}
      onOpenChange={(open) => (open ? openEditor() : closeEditor())}
    >
      <header>
        <Heading as="h2" size="3">
          {item ? "Edit" : "Add"} Gear
        </Heading>
        <Text size="2" color="gray">
          {item
            ? `Update the details of ${item.name}`
            : "Got a new piece of kit?"}
        </Text>
      </header>
      <ItemForm />
    </ResponsiveModal>
  );
};

export default ItemEditor;
