import ItemForm from "@/modules/items/components/item-form";
import { Heading, Text } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/item/$itemId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { itemId } = Route.useParams();
  return (
    <div className="container2 grid gap-4 pt-4 pb-20">
      <header>
        <Heading size="4">Edit Gear</Heading>
        <Text size="2" color="gray">
          Update the details of some gear
        </Text>
      </header>
      <ItemForm />
    </div>
  );
}
