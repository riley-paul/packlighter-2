import { itemsQueryOptions } from "@/modules/sidebar/queries";
import UserAvatar from "@/modules/users/components/user-avatar";
import {
  Button,
  DropdownMenu,
  Heading,
  IconButton,
  Table,
  TextField,
} from "@radix-ui/themes";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/all-gear")({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(itemsQueryOptions);
  },
});

function RouteComponent() {
  const itemsQuery = useSuspenseQuery(itemsQueryOptions);

  return (
    <main>
      <header className="sticky top-0 z-10 bg-gray-1 py-3">
        <article className="container2 grid gap-6">
          <section className="flex items-center justify-between">
            <div className="flex items-baseline gap-4">
              <IconButton asChild variant="ghost" size="3">
                <Link to="/">
                  <i className="fas fa-arrow-left" />
                </Link>
              </IconButton>
              <Heading as="h2">All Gear</Heading>
            </div>
            <UserAvatar />
          </section>
          <section className="flex gap-2">
            <TextField.Root
              className="flex-1"
              type="search"
              placeholder="Search..."
            >
              <TextField.Slot side="left">
                <i className="fas fa-search" />
              </TextField.Slot>
            </TextField.Root>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant="soft">
                  Filter
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item>Hello</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </section>
        </article>
      </header>
      <article className="container2 py-8">
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Weight</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {itemsQuery.data.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.description}</Table.Cell>
                <Table.Cell>{item.weight}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </article>
    </main>
  );
}
