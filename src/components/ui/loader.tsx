import { Spinner, Text } from "@radix-ui/themes";
import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="absolute inset-0">
      <div className="flex h-full w-full items-center justify-center gap-2">
        <Spinner loading />
        <Text size="2" color="gray">
          Loading...
        </Text>
      </div>
    </div>
  );
};

export default Loader;
