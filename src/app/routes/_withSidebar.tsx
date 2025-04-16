import AppSideBar from "@/modules/sidebar/components/sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_withSidebar")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex">
      <AppSideBar />
      <div className="min-h-screen flex-1 overflow-hidden relative">
        <Outlet />
      </div>
    </main>
  );
}
