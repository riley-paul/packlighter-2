import React from "react";

import useMutations from "@/hooks/use-mutations";
import { useCopyToClipboard } from "usehooks-ts";
import { toast } from "sonner";

import {
  Button,
  IconButton,
  Link,
  Popover,
  Switch,
  Text,
  TextField,
  Tooltip,
} from "@radix-ui/themes";
import type { ListSelect } from "@/lib/types";
import { ArrowRightIcon, CheckIcon, CopyIcon, Share2Icon } from "lucide-react";

type Props = {
  list: ListSelect;
};

const ListSharing: React.FC<Props> = (props) => {
  const { list } = props;
  const { updateList } = useMutations();
  const [copiedText, copy] = useCopyToClipboard();

  const publicUrl = `${window.location.origin}/v/${list.id}`;
  const hasBeenCopied = copiedText === publicUrl;
  const handleCopy = () =>
    copy(publicUrl)
      .then(() => toast.success("Copied link to clipboard"))
      .catch(() => toast.error("Failed to copy link"));

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant="soft" color="gray">
          <Share2Icon className="size-4" />
          <span>Share</span>
        </Button>
      </Popover.Trigger>
      <Popover.Content className="w-72">
        <div className="grid gap-4">
          <Text as="label" weight="medium" className="flex items-center gap-2">
            <Switch
              checked={list.isPublic}
              onCheckedChange={(checked) =>
                updateList.mutate({
                  data: { isPublic: checked },
                  listId: list.id,
                })
              }
            />
            Make list public
          </Text>
          {list.isPublic && (
            <div className="grid gap-2">
              <Text size="2" color="gray">
                Anyone with the link can view this list
              </Text>
              <div className="flex items-center gap-2">
                <TextField.Root
                  onFocus={(e) => e.target.select()}
                  type="text"
                  value={publicUrl}
                  readOnly
                  className="min-w-0 flex-1 truncate"
                />
                <Tooltip
                  side="right"
                  content={hasBeenCopied ? "Copied!" : "Copy link"}
                >
                  <IconButton variant="soft" onClick={handleCopy}>
                    {hasBeenCopied ? (
                      <CheckIcon className="size-4" />
                    ) : (
                      <CopyIcon className="size-4" />
                    )}
                  </IconButton>
                </Tooltip>
              </div>
              <Link size="2" className="mt-1" href={publicUrl} target="_blank">
                <span className="flex items-center gap-1">
                  Preview your list
                  <ArrowRightIcon className="size-4" />
                </span>
              </Link>
            </div>
          )}
        </div>
      </Popover.Content>
    </Popover.Root>
  );
};

export default ListSharing;
