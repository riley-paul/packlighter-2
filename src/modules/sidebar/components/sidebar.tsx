import React from "react";
import PackingItems from "./packing-items/packing-items";
import PackingLists from "@/modules/sidebar/components/packing-lists/packing-lists";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { NAVBAR_HEIGHT } from "@/lib/client/constants";

import UserAvatar from "@/modules/users/components/user-avatar";
import Logo from "@/components/logo";
import { useAtom, useSetAtom } from "jotai";
import { desktopSidebarOpenAtom, mobileSidebarOpenAtom } from "../store";
import { cn, getHasModifier, getIsTyping } from "@/lib/client/utils";
import { useEventListener } from "usehooks-ts";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { Button, IconButton, Kbd, Tooltip } from "@radix-ui/themes";
import { commandBarOpenAtom } from "@/components/command-bar";

const AppSideBar: React.FC = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useAtom(
    isMobile ? mobileSidebarOpenAtom : desktopSidebarOpenAtom,
  );
  const setCommandBarOpen = useSetAtom(commandBarOpenAtom);

  useEventListener("keydown", (e) => {
    if (getIsTyping() || getHasModifier(e)) return;
    if (e.code === "KeyB") {
      setIsOpen((prev) => !prev);
    }
    if (isMobile && e.code === "Escape") {
      setIsOpen(false);
    }
  });

  return (
    <>
      {!isMobile && (
        <div
          className={cn(
            "transition-all duration-200 ease-in-out",
            isOpen ? "w-[20rem]" : "w-0",
          )}
        />
      )}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-10 bg-panel-translucent backdrop-blur"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div
        className={cn(
          "fixed bottom-0 left-0 top-0 z-20 w-[20rem] p-2 pr-0 transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="relative flex h-full w-full flex-col rounded-4 border bg-panel-solid">
          <header
            className="flex items-center justify-between border-b px-4"
            style={{ height: NAVBAR_HEIGHT }}
          >
            <Logo />
            <div className="flex items-center gap-2">
              <Tooltip
                content={
                  <>
                    Search <Kbd>⌘ K</Kbd>
                  </>
                }
                side="bottom"
              >
                <IconButton
                  size="1"
                  radius="full"
                  variant="soft"
                  onClick={() => setCommandBarOpen(true)}
                >
                  <i className="fa-solid fa-search text-1" />
                </IconButton>
              </Tooltip>
              <UserAvatar />
            </div>
          </header>
          <ResizablePanelGroup autoSaveId="sidebar-panels" direction="vertical">
            <ResizablePanel defaultSize={40}>
              <PackingLists />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <PackingItems />
            </ResizablePanel>
          </ResizablePanelGroup>
          <div className="absolute -right-4 bottom-0 top-0 flex flex-col justify-center">
            <Button
              onClick={() => setIsOpen((prev) => !prev)}
              variant="ghost"
              size="1"
              color="gray"
              className="m-0 my-auto h-full w-3 p-0"
              radius="full"
            >
              <i
                className={cn(
                  "fa-solid fa-xs",
                  isOpen ? "fa-chevron-left" : "fa-chevron-right",
                )}
              />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppSideBar;
