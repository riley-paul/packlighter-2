import React from "react";
import {
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
import { listsQueryOptions } from "@/lib/queries";
import { useNavigate } from "react-router-dom";
import useMutations from "@/hooks/use-mutations";
import { cn } from "@/lib/utils";
import { ACCENT_COLOR } from "@/lib/constants";

const CommandBar: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const { addList } = useMutations();

  useEventListener("keydown", (event) => {
    if (event.key === "k" && event.metaKey) {
      event.preventDefault();
      setOpen(true);
    }
  });

  const { data: lists = [] } = useQuery(listsQueryOptions);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
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
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Lists">
          {lists.map((list) => (
            <CommandItem
              key={list.id}
              onSelect={() => {
                navigate(`/list/${list.id}`);
                setOpen(false);
              }}
            >
              {list.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandBar;
