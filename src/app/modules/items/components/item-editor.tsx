import React from "react";
import ItemFormComponent from "./item-form";
import ResponsiveModal from "@/app/components/ui/responsive-modal";
import { Dialog } from "@radix-ui/themes";
import { useAtomValue, useSetAtom } from "jotai";
import {
  closeEditorAtom,
  editorItemAtom,
  editorOpenAtom,
  openEditorAtom,
} from "../items.store";

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
        <Dialog.Title size="4" className="m-0">
          {item ? "Edit" : "Add"} Gear
        </Dialog.Title>
        <Dialog.Description size="2" color="gray">
          {item
            ? `Update the details of ${item.name}`
            : "Got a new piece of kit?"}
        </Dialog.Description>
      </header>
      <ItemFormComponent />
    </ResponsiveModal>
  );
};

export default ItemEditor;
