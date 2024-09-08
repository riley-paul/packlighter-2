import { Toaster } from "sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Root from "./root";
import HomePage from "./home-page";
import ListPage from "./list-page";
import ErrorDisplay from "./components/base/error";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorDisplay />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "list/:listId",
        element: <ListPage />,
      },
    ],
  },
]);

// Render the app
const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <RouterProvider router={router} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
