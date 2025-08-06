import AlertSystem from "@/app/components/alert-system/alert-system";
import CommandBar from "@/app/modules/command-bar/command-bar";
import FeedbackButton from "@/app/modules/feedback/feedback-button";
import ItemEditor from "@/app/modules/items/components/item-editor";
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
      <AlertSystem />
      <ItemEditor />
      <CommandBar />
      <Outlet />
      <div className="fixed bottom-6 right-6 flex items-center gap-4">
        <FeedbackButton />
      </div>
    </>
  );
}
