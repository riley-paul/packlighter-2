import { Dialog } from "@radix-ui/themes";
import React from "react";

type Props = {
  title: string;
  message: string;
};

const AlertSystemTitleMessage: React.FC<Props> = ({ title, message }) => {
  return (
    <>
      <Dialog.Title size="4" mb="1">
        {title}
      </Dialog.Title>
      <Dialog.Description size="2" color="gray">
        {message}
      </Dialog.Description>
    </>
  );
};

export default AlertSystemTitleMessage;
