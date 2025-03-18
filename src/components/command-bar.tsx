import React from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useEventListener } from "usehooks-ts";
import { useQuery } from "@tanstack/react-query";
import useMutations from "@/hooks/use-mutations";
import { cn } from "@/lib/client/utils";
import { ACCENT_COLOR } from "@/lib/client/constants";
import { atom, useAtom, useSetAtom } from "jotai";
import { openEditorAtom } from "@/modules/items/store";
import { useNavigate } from "@tanstack/react-router";
import { listLinkOptions } from "@/lib/client/links";
import {
  listsQueryOptions,
  itemsQueryOptions,
} from "@/modules/sidebar/queries";

export const commandBarOpenAtom = atom(false);

const CommandBar: React.FC = () => {
  const [open, setOpen] = useAtom(commandBarOpenAtom);
  const openEditor = useSetAtom(openEditorAtom);

  const navigate = useNavigate();

  const { addList } = useMutations();

  useEventListener("keydown", (event) => {
    if (event.key === "k" && event.metaKey) {
      event.preventDefault();
      setOpen(true);
    }
  });

  const { data: lists = [] } = useQuery(listsQueryOptions);
  const { data: items = [] } = useQuery(itemsQueryOptions);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command loop>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem
              onSelect={() => {
                addList.mutate({});
                setOpen(false);
              }}
            >
              <div className="flex items-center gap-2">
                <i
                  className={cn("fa-solid fa-plus", `text-${ACCENT_COLOR}-10`)}
                />
                Add List
              </div>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                openEditor();
                setOpen(false);
              }}
            >
              <div className="flex items-center gap-2">
                <i
                  className={cn("fa-solid fa-plus", `text-${ACCENT_COLOR}-10`)}
                />
                Add Gear
              </div>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Lists">
            {lists.map((list) => (
              <CommandItem
                key={list.id}
                onSelect={() => {
                  navigate(listLinkOptions(list.id));
                  setOpen(false);
                }}
              >
                {list.name}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />
          <CommandGroup heading="Gear">
            {items.map((item) => (
              <CommandItem
                key={item.id}
                onSelect={() => {
                  setOpen(false);
                  openEditor(item);
                }}
              >
                {item.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
};

export default CommandBar;
