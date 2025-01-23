import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ErrorDisplay from "@/components/base/error";
import HomePage from "@/app/home-page";
import ListPage from "@/app/list-page";
import Root from "@/app/root";
import RadixProvider from "@/components/base/radix-provider";
import CustomToaster from "@/components/ui/custom-toaster";

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
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RadixProvider>
        <CustomToaster />
        <RouterProvider router={router} />
      </RadixProvider>
    </QueryClientProvider>
  );
};

export default App;
