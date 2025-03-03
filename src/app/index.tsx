import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import RadixProvider from "@/components/base/radix-provider";
import CustomToaster from "@/components/ui/custom-toaster";
import useMutationHelpers from "@/hooks/use-mutation-helpers";

const { onError } = useMutationHelpers();

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
  mutationCache: new MutationCache({ onError }),
});

const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
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
