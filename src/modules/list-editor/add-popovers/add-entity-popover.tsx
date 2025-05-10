import React from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { Button, Popover, Spinner } from "@radix-ui/themes";
import { toTitleCase } from "@/lib/client/utils";
import { CommandLoading } from "cmdk";

const NEW_ENTITY_VALUE = "create-new-category-" + crypto.randomUUID();

type Props<T extends { id: string }> = {
  entityName: string;
  entities: T[];
  groupHeader: string;
  getEntityValue: (entity: T) => string;
  handleAdd: (value: string) => void;
  handleEntitySelect: (id: string) => void;
  renderEntity: (entity: T) => React.ReactNode;
  isLoading?: boolean;
};

function AddEntityPopover<T extends { id: string }>({
  entityName,
  entities,
  groupHeader,
  getEntityValue,
  handleAdd,
  handleEntitySelect,
  renderEntity,
  isLoading,
}: Props<T>) {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const [isOpen, setIsOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>("");

  return (
    <Popover.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (open) setValue("");
        setIsOpen(open);
      }}
    >
      <Popover.Trigger>
        <Button
          ref={buttonRef}
          size="1"
          variant="ghost"
          role="combobox"
          aria-expanded={isOpen}
        >
          <i className="fa-solid fa-plus" />
          <span>Add {toTitleCase(entityName)}</span>
        </Button>
      </Popover.Trigger>
      <Popover.Content
        className="z-30 w-[400px] p-0"
        align="start"
        side="bottom"
      >
        <Command
          loop
          filter={(value, search) => {
            if (value === NEW_ENTITY_VALUE) return 1;
            if (value.toLowerCase().includes(search.toLowerCase())) return 1;
            return 0;
          }}
        >
          <CommandInput
            placeholder="Enter name..."
            value={value}
            onValueChange={setValue}
          />
          <CommandList>
            {isLoading && (
              <CommandLoading>
                <Spinner />
              </CommandLoading>
            )}
            <CommandEmpty> No suggestions </CommandEmpty>
            {value && (
              <CommandGroup>
                <CommandItem
                  value={NEW_ENTITY_VALUE}
                  onSelect={() => {
                    handleAdd(value);
                    setIsOpen(false);
                    buttonRef.current?.focus();
                  }}
                >
                  <i className="fa-solid fa-plus mr-2 text-accent-10" />
                  <span>
                    Create new {entityName} "{value}"
                  </span>
                </CommandItem>
              </CommandGroup>
            )}
            {entities.length > 0 && (
              <>
                <CommandGroup heading={groupHeader}>
                  {entities?.map((entity) => (
                    <CommandItem
                      key={entity.id}
                      value={getEntityValue(entity)}
                      onSelect={() => {
                        handleEntitySelect(entity.id);
                        setIsOpen(false);
                        buttonRef.current?.focus();
                      }}
                    >
                      {renderEntity(entity)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </Popover.Content>
    </Popover.Root>
  );
}

export default AddEntityPopover;
