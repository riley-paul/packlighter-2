import { useSuspenseQuery } from "@tanstack/react-query";
import EditorCategories from "@/components/list-editor/editor-categories";
import ListDescription from "@/components/list-description";
import ListSettings from "@/components/list-settings";
import { listQueryOptions } from "@/lib/queries";
import ErrorDisplay from "@/components/base/error-display";
import ListSharing from "@/components/list-sharing";
import ListName from "@/components/list-name";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/list/$listId")({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params: { listId } }) => {
    queryClient.ensureQueryData(listQueryOptions(listId));
  },
});

function RouteComponent() {
  const { listId } = Route.useParams();
  const { data: list } = useSuspenseQuery(listQueryOptions(listId));

  if (!list)
    return (
      <div className="h-full">
        <ErrorDisplay message="List not found" showGoHome />
      </div>
    );

  return (
    <div className="flex h-full flex-col overflow-auto">
      <div className="container2 flex flex-col gap-8 py-6 pb-20">
        <header className="grid gap-5">
          <ListName list={list} />
          <div className="grid w-72 grid-cols-2 gap-2">
            <ListSharing list={list} />
            <ListSettings list={list} />
          </div>
        </header>
        <ListDescription list={list} />
        <EditorCategories categories={list.categories} />
      </div>
    </div>
  );
}
