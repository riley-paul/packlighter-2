import { useSuspenseQuery } from "@tanstack/react-query";
import ListDescription from "@/modules/list-editor/list-description";
import ListSettings from "@/modules/list-editor/list-settings";
import { listQueryOptions } from "@/lib/client/queries";
import ErrorDisplay from "@/components/ui/error-display";
import ListSharing from "@/modules/list-editor/list-sharing";
import { createFileRoute } from "@tanstack/react-router";
import ListName from "@/modules/list-editor/list-name";
import EditorCategories from "@/modules/list-editor/editor-categories";
import WeightChart from "@/modules/weight-chart/weight-chart";

export const Route = createFileRoute("/_withSidebar/list/$listId")({
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
        <WeightChart list={list} />
        <ListDescription list={list} />
        <EditorCategories categories={list.categories} />
      </div>
    </div>
  );
}
