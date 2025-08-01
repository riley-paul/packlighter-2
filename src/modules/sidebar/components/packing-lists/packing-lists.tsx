import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PackingList from "./packing-list";
import { cn } from "@/lib/client/utils";
import useMutations from "@/hooks/use-mutations";

import ArrayQueryGuard from "@/components/ui/array-query-guard";

import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";
import { DndEntityType, isDndEntityType } from "@/lib/client/constants";
import SidebarSectionHeader from "@/modules/sidebar/components/sidebar-section-header";
import useScrollShadow from "@/hooks/use-scroll-shadow";
import { useVirtualizer } from "@tanstack/react-virtual";
import useCurrentList from "@/hooks/use-current-list";
import { ScrollArea } from "@radix-ui/themes";
import { zListSelect } from "@/lib/types";
import { listsQueryOptions } from "@/lib/client/queries";
import { PlusIcon } from "lucide-react";

export default function PackingLists(): ReturnType<React.FC> {
  const listsQuery = useQuery(listsQueryOptions);
  const lists = listsQuery.data ?? [];
  const { addList, updateList } = useMutations();

  const queryClient = useQueryClient();

  React.useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return isDndEntityType(source.data, DndEntityType.List);
      },
      onDrop({ location, source }) {
        const target = location.current.dropTargets[0];
        if (!target) {
          return;
        }

        const sourceData = zListSelect.safeParse(source.data);
        const targetData = zListSelect.safeParse(target.data);

        if (!sourceData.success || !targetData.success) {
          return;
        }

        const sourceId = sourceData.data.id;
        const targetId = targetData.data.id;

        const indexOfSource = lists.findIndex((i) => i.id === sourceId);
        const indexOfTarget = lists.findIndex((i) => i.id === targetId);

        if (indexOfTarget < 0 || indexOfSource < 0) {
          return;
        }

        const closestEdgeOfTarget = extractClosestEdge(target.data);

        const newSortOrder = getReorderDestinationIndex({
          startIndex: indexOfSource,
          indexOfTarget,
          closestEdgeOfTarget,
          axis: "vertical",
        });

        const newLists = reorderWithEdge({
          list: lists,
          startIndex: indexOfSource,
          indexOfTarget,
          closestEdgeOfTarget,
          axis: "vertical",
        });

        updateList.mutate({
          data: { sortOrder: newSortOrder },
          listId: sourceId,
        });

        queryClient.setQueryData(listsQueryOptions.queryKey, newLists);
      },
    });
  }, [lists]);

  const { listRef, isScrolled } = useScrollShadow();

  const rowVirtualizer = useVirtualizer({
    count: lists.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => 36,
    scrollPaddingEnd: 8,
    scrollPaddingStart: 8,
  });

  const { listId } = useCurrentList();
  React.useEffect(() => {
    if (!listId) return;
    const index = lists.findIndex((list) => list.id === listId);
    if (index < 0) return;
    rowVirtualizer.scrollToIndex(index, { behavior: "smooth" });
  }, [listId, lists.length]);

  return (
    <div className="flex h-full flex-col">
      <div
        className={cn("px-4 py-2 transition-shadow", isScrolled && "shadow")}
      >
        <SidebarSectionHeader
          title="Lists"
          action={{
            children: (
              <>
                <PlusIcon className="size-3" />
                <span>Add List</span>
              </>
            ),
            onClick: () => addList.mutate({}),
          }}
          count={lists.length}
        />
      </div>
      <ScrollArea
        type="hover"
        ref={listRef}
        className={cn("relative h-full overflow-y-auto overflow-x-hidden py-1")}
      >
        <ArrayQueryGuard query={listsQuery} placeholder="No lists yet">
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => (
              <div
                key={virtualItem.key}
                ref={rowVirtualizer.measureElement}
                data-index={virtualItem.index}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <PackingList list={lists[virtualItem.index]} />
              </div>
            ))}
          </div>
        </ArrayQueryGuard>
      </ScrollArea>
    </div>
  );
}
