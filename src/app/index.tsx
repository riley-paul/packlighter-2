import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import RadixProvider from "@/components/ui/radix-provider";
import CustomToaster from "@/components/ui/custom-toaster";
import { toast } from "sonner";
import ErrorDisplay from "@/components/ui/error-display";
import Loader from "@/components/ui/loader";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
  mutationCache: new MutationCache({
    onError: (error) => {
      console.error(error);
      toast.error(error.message ?? "Server Error");
    },
  }),
});

const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
  defaultErrorComponent: ({ error }) => {
    return <ErrorDisplay message={error.message} showGoHome />;
  },
  defaultNotFoundComponent: () => {
    return <ErrorDisplay message="Not found" status={404} showGoHome />;
  },
  defaultPendingComponent: () => {
    return <Loader />;
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <RadixProvider>
      <CustomToaster />
      <RouterProvider router={router} />
    </RadixProvider>
  </QueryClientProvider>
);

export default App;
