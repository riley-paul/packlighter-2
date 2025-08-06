import React from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/app/components/ui/command";

import { Button, Popover, Spinner } from "@radix-ui/themes";
import { cn, toTitleCase } from "@/lib/client/utils";
import { CommandLoading } from "cmdk";
import { useFocusManager } from "@/app/components/focus-manager-provider";
import { PlusIcon } from "lucide-react";

type Props<T extends { id: string }> = {
  entityName: string;
  entities: T[];
  groupHeader?: string;
  className?: string;
  getEntityValue: (entity: T) => string;
  getEntityDisabled?: (entity: T) => boolean;
  handleAdd: (value: string) => void;
  handleEntitySelect: (id: string) => void;
  renderEntity: (entity: T) => React.ReactNode;
  isLoading?: boolean;
};

function AddEntityPopover<T extends { id: string }>({
  entityName,
  entities,
  groupHeader,
  className,
  getEntityValue,
  getEntityDisabled,
  handleAdd,
  handleEntitySelect,
  renderEntity,
  isLoading,
}: Props<T>) {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const setFocus = useFocusManager();

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
          <PlusIcon className="size-3" />
          <span>Add {toTitleCase(entityName)}</span>
        </Button>
      </Popover.Trigger>
      <Popover.Content
        className={cn("min-w-64 p-0", className)}
        align="start"
        side="bottom"
      >
        <Command loop>
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
                        setFocus(buttonRef.current);
                      }}
                      disabled={getEntityDisabled?.(entity)}
                    >
                      {renderEntity(entity)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
            {value && (
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    handleAdd(value);
                    setIsOpen(false);
                    setFocus(buttonRef.current);
                  }}
                  className="flex items-center gap-1.5"
                >
                  <PlusIcon className="size-4 text-accent-10" />
                  <span>
                    Create new {entityName} "{value}"
                  </span>
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </Popover.Content>
    </Popover.Root>
  );
}

export default AddEntityPopover;
