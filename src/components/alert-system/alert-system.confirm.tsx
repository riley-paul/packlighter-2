import React from "react";
import type { ConfirmAlertProps } from "./alert-system.types";
import { Dialog, Button } from "@radix-ui/themes";
import AlertSystemTitleMessage from "./alert-system-title-message";

const AlertSystemContentConfirm: React.FC<ConfirmAlertProps> = ({
  title,
  message,
  handleConfirm,
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
        <Button onClick={handleConfirm}>Confirm</Button>
      </footer>
    </>
  );
};

export default AlertSystemContentConfirm;
