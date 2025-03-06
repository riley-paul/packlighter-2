import CommandBar from "@/components/command-bar";
import FeedbackButton from "@/modules/feedback/feedback-button";
import ItemEditor from "@/modules/items/components/item-editor";
import AppSideBar from "@/modules/sidebar/components/sidebar";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: Component,
  },
);

function Component() {
  return (
    <main className="flex">
      <ItemEditor />
      <CommandBar />
      <AppSideBar />
      <div className="min-h-screen flex-1 overflow-hidden">
        <Outlet />
      </div>
      <div className="fixed bottom-6 right-6 flex items-center gap-4">
        <FeedbackButton />
      </div>
    </main>
  );
}
