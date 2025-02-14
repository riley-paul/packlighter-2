import React from "react";

import { centerDragPreviewOnMouse, cn } from "@/lib/utils";
import type { ExpandedCategory } from "@/lib/types";
import useDraggableState from "@/hooks/use-draggable-state";
import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import invariant from "tiny-invariant";
import {
  DND_ENTITY_TYPE,
  DndEntityType,
  isDndEntityType,
} from "@/lib/constants";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import useEditorColumns from "./use-editor-columns";
import EditorCategoryItem from "./editor-category-item";
import useListTableState from "../../hooks/use-list-table-state";
import EditorCategoryPlaceholder from "./editor-category-placeholder";
import useCurrentList from "@/hooks/use-current-list";
import { Portal } from "@radix-ui/themes";
import RadixProvider from "../base/radix-provider";
import Gripper from "../base/gripper";
import DropIndicatorWrapper from "../ui/drop-indicator-wrapper";

interface Props {
  category: ExpandedCategory;
  isOverlay?: boolean;
}

const EditorCategory: React.FC<Props> = (props) => {
  const { category, isOverlay } = props;

  const ref = React.useRef<HTMLDivElement>(null);
  const gripperRef = React.useRef<HTMLButtonElement>(null);
  const addItemRef = React.useRef<HTMLButtonElement>(null);

  const { draggableState, setDraggableState, setDraggableIdle } =
    useDraggableState();

  React.useEffect(() => {
    const element = ref.current;
    const gripper = gripperRef.current;
    invariant(element);
    invariant(gripper);

    return combine(
      draggable({
        element: gripper,
        getInitialData: () => ({
          [DND_ENTITY_TYPE]: DndEntityType.Category,
          ...category,
        }),
        onGenerateDragPreview({ location, nativeSetDragImage }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: centerDragPreviewOnMouse(location, element),
            render({ container }) {
              setDraggableState({ type: "preview", container });
            },
          });
        },
        onDragStart() {
          setDraggableState({ type: "is-dragging" });
        },
        onDrop() {
          setDraggableIdle();
        },
      }),
      dropTargetForElements({
        element,
        canDrop({ source }) {
          // not allowing dropping on yourself
          if (source.data.id === category.id) {
            return false;
          }
          // only allowing tasks to be dropped on me
          return isDndEntityType(source.data, DndEntityType.Category);
        },
        getData({ input }) {
          return attachClosestEdge(category, {
            element,
            input,
            allowedEdges: ["top", "bottom"],
          });
        },
        getIsSticky() {
          return true;
        },
        onDragEnter({ self, source }) {
          if (!isDndEntityType(source.data, DndEntityType.Category)) return;
          const closestEdge = extractClosestEdge(self.data);
          setDraggableState({ type: "is-dragging-over", closestEdge });
        },
        onDrag({ self, source }) {
          if (!isDndEntityType(source.data, DndEntityType.Category)) return;
          const closestEdge = extractClosestEdge(self.data);

          // Only need to update react state if nothing has changed.
          // Prevents re-rendering.
          setDraggableState((current) => {
            if (
              current.type === "is-dragging-over" &&
              current.closestEdge === closestEdge
            ) {
              return current;
            }
            return { type: "is-dragging-over", closestEdge };
          });
        },
        onDragLeave() {
          setDraggableIdle();
        },
        onDrop() {
          setDraggableIdle();
        },
      }),
    );
  }, [category]);

  const columns = useEditorColumns({ category, addItemRef });

  const { list } = useCurrentList();
  const { columnVisibility } = useListTableState(list);

  const table = useReactTable({
    data: category.items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility,
    },
  });

  return (
    <>
      <DropIndicatorWrapper draggableState={draggableState} gap="1rem">
        <div
          ref={ref}
          key={category.id}
          data-category-id={category.id}
          className={cn(
            "relative flex w-full flex-col rounded-3",
            isOverlay && "w-[800px] border bg-gray-2",
          )}
        >
          <header className="text-sm font-semibold text-muted-foreground w-full border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <div
                className="text-sm hover:bg-muted/50 flex h-12 w-full items-center gap-2 px-1 transition-colors"
                key={headerGroup.id}
              >
                <Gripper ref={gripperRef} />
                {headerGroup.headers.map((header) => (
                  <React.Fragment key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </React.Fragment>
                ))}
              </div>
            ))}
          </header>
          <section>
            {table.getRowModel().rows.map((row) => (
              <EditorCategoryItem key={row.id} row={row} />
            ))}

            {table.getRowCount() === 0 && (
              <EditorCategoryPlaceholder categoryId={category.id} />
            )}
          </section>
          <footer>
            {table.getFooterGroups().map((footerGroup) => (
              <div
                key={footerGroup.id}
                className="text-sm hover:bg-muted/50 flex h-12 w-full items-center gap-1 px-2 transition-colors"
              >
                {footerGroup.headers.map((header) => (
                  <React.Fragment key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext(),
                        )}
                  </React.Fragment>
                ))}
              </div>
            ))}
          </footer>
        </div>
      </DropIndicatorWrapper>

      {draggableState.type === "preview" ? (
        <Portal container={draggableState.container}>
          <RadixProvider>
            <EditorCategory category={category} isOverlay />
          </RadixProvider>
        </Portal>
      ) : null}
    </>
  );
};

export default EditorCategory;
