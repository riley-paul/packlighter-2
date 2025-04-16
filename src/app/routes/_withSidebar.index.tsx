import useMutations from '@/hooks/use-mutations'
import { Button, Heading, Separator, Text } from '@radix-ui/themes'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_withSidebar/')({ component: RouteComponent })

function RouteComponent() {
  const { addList } = useMutations()
  return (
    <div className="h-full">
      <div className="container2 flex h-full items-center justify-center">
        <div className="flex h-full max-h-[50vh] flex-col items-center gap-2">
          <i className="fa-solid fa-house-chimney mb-4 text-[3rem] text-accent-10" />
          <Heading as="h2" size="4">
            Welcome to LighterTravel
          </Heading>
          <Text size="2" color="gray">
            Select a list to get packing
          </Text>
          <div className="flex w-full items-center gap-2">
            <Separator size="4" />
            <Text size="2" weight="medium">
              OR
            </Text>
            <Separator size="4" />
          </div>
          <Button variant="soft" onClick={() => addList.mutate({})}>
            <i className="fa-solid fa-plus" />
            <span>Create a new list</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
