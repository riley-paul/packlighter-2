import { themeAtom } from "@/app/modules/theme/theme.store";
import { Spinner } from "@radix-ui/themes";
import { useAtomValue } from "jotai";
import { CircleCheckIcon, TriangleAlertIcon, InfoIcon } from "lucide-react";
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
        success: <CircleCheckIcon className="size-4 text-green-10" />,
        error: <TriangleAlertIcon className="size-4 text-red-10" />,
        info: <InfoIcon className="size-4" />,
      }}
    />
  );
};

export default CustomToaster;
