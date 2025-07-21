import React from "react";

import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/client/utils";
import { Avatar, Link, DropdownMenu, Text } from "@radix-ui/themes";
import useUsersMutations from "@/modules/users/users.mutations";
import { userQueryOptions } from "@/lib/client/queries";
import { useAtom } from "jotai";
import { alertSystemAtom } from "@/components/alert-system/alert-system.store";
import { themeAtom } from "@/modules/theme/theme.store";
import { themeOptions } from "@/modules/theme/theme.constants";
import type { Theme } from "@/modules/theme/theme.types";

const UserAvatar: React.FC = () => {
  const { deleteUser } = useUsersMutations();
  const { data: user } = useQuery(userQueryOptions);

  const [, dispatchAlert] = useAtom(alertSystemAtom);
  const [theme, setTheme] = useAtom(themeAtom);

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

  const selectedTheme =
    themeOptions.find((t) => t.value === theme) ?? themeOptions[0];

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger title="User settings" className="cursor-pointer">
        <button>
          <Avatar
            size="2"
            src={user.avatarUrl ?? ""}
            fallback={<i className="fa-solid fa-user" />}
            radius="full"
          />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start" className="min-w-52">
        <div className="flex max-w-min gap-4 p-3">
          <Avatar
            size="4"
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

        <DropdownMenu.Separator />

        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>
            <i className={cn("opacity-70", selectedTheme.icon)} />
            <span>{selectedTheme.name}</span>
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.RadioGroup
              value={theme}
              onValueChange={(value) => setTheme(value as Theme)}
            >
              {themeOptions.map((option) => (
                <DropdownMenu.RadioItem key={option.value} value={option.value}>
                  <i className={cn("opacity-70", option.icon)} />
                  <span>{option.name}</span>
                </DropdownMenu.RadioItem>
              ))}
            </DropdownMenu.RadioGroup>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>

        <DropdownMenu.Item asChild>
          <a href="/logout">
            <i className="fas fa-arrow-right-from-bracket" />
            <span>Logout</span>
          </a>
        </DropdownMenu.Item>
        <DropdownMenu.Item color="red" onClick={handleDelete}>
          <i className="fas fa-trash" />
          <span>Delete Account</span>
        </DropdownMenu.Item>
        <Link href="/policies" size="1" color="gray" className="px-3 py-1">
          View application policies
        </Link>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default UserAvatar;
