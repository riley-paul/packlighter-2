import CommandBar from "@/components/command-bar";
import FeedbackButton from "@/modules/feedback/feedback-button";
import ItemEditor from "@/modules/items/components/item-editor";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: Component,
  },
);

function Component() {
  return (
    <>
      <ItemEditor />
      <CommandBar />
      <Outlet />
      <div className="fixed bottom-6 right-6 flex items-center gap-4">
        <FeedbackButton />
      </div>
    </>
  );
}
