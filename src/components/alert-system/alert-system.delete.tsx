import React from "react";
import type { DeleteAlertProps } from "./alert-system.types";
import { Dialog, Button } from "@radix-ui/themes";
import AlertSystemTitleMessage from "./alert-system-title-message";

const AlertSystemContentDelete: React.FC<DeleteAlertProps> = ({
  title,
  message,
  handleDelete,
}) => {
  return (
    <>
      <AlertSystemTitleMessage title={title} message={message} />
      <footer className="mt-4 flex justify-end gap-3">
        <Dialog.Close>
          <Button variant="soft" color="gray">
            Cancel
          </Button>
        </Dialog.Close>
        <Button onClick={handleDelete} color="red">
          Delete
        </Button>
      </footer>
    </>
  );
};

export default AlertSystemContentDelete;
