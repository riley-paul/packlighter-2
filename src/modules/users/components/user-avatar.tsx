import React from "react";

import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/client/utils";
import ThemeToggle from "@/modules/theme/theme-toggle";
import { Avatar, Button, Link, Popover, Text } from "@radix-ui/themes";
import useUsersMutations from "@/modules/users/users.mutations";
import { userQueryOptions } from "@/lib/client/queries";
import { useAtom } from "jotai";
import { alertSystemAtom } from "@/components/alert-system/alert-system.store";

const UserAvatar: React.FC = () => {
  const { deleteUser } = useUsersMutations();
  const { data: user } = useQuery(userQueryOptions);

  const [, dispatchAlert] = useAtom(alertSystemAtom);

  const handleDelete = () => {
    dispatchAlert({
      type: "open",
      data: {
        type: "delete",
        title: "Delete Account",
        message:
          "Are you sure you want to delete your account? This action cannot be undone.",
        handleDelete: () => {
          deleteUser.mutate({});
          dispatchAlert({ type: "close" });
        },
      },
    });
  };

  if (!user) {
    return null;
  }

  return (
    <Popover.Root>
      <Popover.Trigger title="User settings" className="cursor-pointer">
        <button>
          <Avatar
            size="2"
            src={user.avatarUrl ?? ""}
            fallback={<i className="fa-solid fa-user" />}
            radius="full"
          />
        </button>
      </Popover.Trigger>
      <Popover.Content
        align="start"
        className="z-30 grid w-auto min-w-52 gap-4"
      >
        <div className="flex max-w-min gap-4">
          <Avatar
            size="5"
            radius="full"
            src={user.avatarUrl ?? ""}
            alt={user.name}
            fallback={<i className="fa-solid fa-user text-6" />}
          />
          <div className="flex flex-col justify-center">
            <Text weight="bold" size="3">
              {user.name}
            </Text>
            <Text
              size="2"
              color="gray"
              className="text-sm text-muted-foreground"
            >
              {user.email}
            </Text>
          </div>
        </div>

        <ThemeToggle />

        <div className="grid w-full gap-2">
          <Button asChild variant="soft" color="amber">
            <a href="/logout" className={cn("relative")}>
              <i className="fa-solid fa-arrow-right-from-bracket absolute left-4 w-4" />
              <span>Logout</span>
            </a>
          </Button>
          <Button
            color="red"
            variant="soft"
            onClick={handleDelete}
            className="relative"
          >
            <i className="fa-solid fa-trash absolute left-4 w-4" />
            <span>Delete Account</span>
          </Button>
        </div>
        <Link href="/policies" size="1" color="gray">
          View application policies
        </Link>
      </Popover.Content>
    </Popover.Root>
  );
};

export default UserAvatar;
