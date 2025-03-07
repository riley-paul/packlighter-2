import ItemForm from "@/modules/items/components/item-form";
import { itemQueryOptions } from "@/modules/items/queries";
import { Heading, Text } from "@radix-ui/themes";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/item/$itemId")({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params: { itemId } }) => {
    queryClient.ensureQueryData(itemQueryOptions(itemId));
  },
});

function RouteComponent() {
  const { itemId } = Route.useParams();
  const { data: item } = useSuspenseQuery(itemQueryOptions(itemId));

  return (
    <div className="container2 grid gap-4 pb-20 pt-4">
      <header>
        <Heading size="4">Edit Gear</Heading>
        <Text size="2" color="gray">
          Update the details of "{item.name}"
        </Text>
      </header>
      <ItemForm item={item} />
    </div>
  );
}
