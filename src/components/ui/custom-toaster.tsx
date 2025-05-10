import { themeAtom } from "@/modules/theme/theme.store";
import { Spinner } from "@radix-ui/themes";
import { useAtomValue } from "jotai";
import React from "react";
import { Toaster } from "sonner";

const CustomToaster: React.FC = () => {
  const theme = useAtomValue(themeAtom);
  return (
    <Toaster
      theme={theme}
      toastOptions={{
        className: "bg-panel backdrop-blur border border-gray-6",
      }}
      icons={{
        loading: <Spinner />,
        success: <i className="fa-solid fa-circle-check text-green-10" />,
        error: <i className="fa-solid fa-exclamation-triangle text-red-10" />,
        info: <i className="fa-solid fa-circle-info" />,
      }}
    />
  );
};

export default CustomToaster;
