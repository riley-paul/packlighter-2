import React from "react";
import ItemForm from "./item-form";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useItemEditorStore from "./store";
import ResponsiveModal from "../base/responsive-modal";

const ItemEditor: React.FC = () => {
  const { closeEditor, openEditor, isEditorOpen, item } = useItemEditorStore();

  return (
    <ResponsiveModal
      open={isEditorOpen}
      onOpenChange={(open) => (open ? openEditor() : closeEditor())}
    >
      <DialogHeader>
        <DialogTitle>{item ? "Edit" : "Add"} Gear</DialogTitle>
        <DialogDescription>
          {item
            ? `Update the details of ${item.name}`
            : "Got a new piece of kit?"}
        </DialogDescription>
      </DialogHeader>
      <ItemForm />
    </ResponsiveModal>
  );
};

export default ItemEditor;
