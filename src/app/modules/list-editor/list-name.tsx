import useMutations from "@/app/hooks/use-mutations";
import { cn } from "@/lib/client/utils";
import { Button, Heading } from "@radix-ui/themes";
import React from "react";
import type { ListSelect } from "@/lib/types";
import ConditionalForm from "@/app/components/input/conditional-form";

const PLACEHOLDER = "Unnamed List";

const ListName: React.FC<{ list: ListSelect }> = ({ list }) => {
  const { updateList } = useMutations();
  return (
    <ConditionalForm
      value={list.name}
      handleSubmit={(value) =>
        updateList.mutate({ listId: list.id, data: { name: value } })
      }
      textFieldProps={{
        size: "3",
        placeholder: PLACEHOLDER,
      }}
    >
      {({ startEditing, displayValue }) => (
        <div className="flex min-h-[2.5rem] items-center gap-4">
          <Heading
            onClick={startEditing}
            className={cn(!list.name && "italic text-gray-10")}
          >
            {displayValue || PLACEHOLDER}
          </Heading>
          <Button size="1" variant="ghost" onClick={startEditing}>
            Edit
          </Button>
        </div>
      )}
    </ConditionalForm>
  );
};

export default ListName;
