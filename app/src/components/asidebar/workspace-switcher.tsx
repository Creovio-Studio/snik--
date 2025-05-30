"use client";

import { useRouter } from "next/navigation";
import {
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import useCreateWorkspaceDialog from "@/hooks/use-create-workspace-dialog";
import useWorkspaceId from "@/hooks/use-workspace";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllWorkspaceUserIsMemberQueryFn } from "@/lib/api";
import { Check, ChevronDown, Loader, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";

type WorkspaceType = {
  workspace_id: string;
  name: string;
};

export function WorkspaceSwitcher() {
  const router = useRouter();

  const { onOpen } = useCreateWorkspaceDialog();

  const workspaceId = useWorkspaceId();
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceType>();

  const { data, isPending } = useQuery({
    queryKey: ["userWorkspaces"],
    queryFn: getAllWorkspaceUserIsMemberQueryFn,
    staleTime: 1,
    refetchOnMount: true,
  });
  const workspaces = data?.workspaces;
  useEffect(() => {
    if (workspaces?.length) {
      const workspace = workspaceId
        ? workspaces.find((ws) => ws.workspace_id === workspaceId)
        : workspaces[0];
      if (workspace) {
        setActiveWorkspace(workspace);
        if (!workspaceId) router.push(`/workspace/${workspace.workspace_id}`);
      }
    }
  }, [workspaceId, workspaces, router]);

  const onSelect = (workspace: WorkspaceType) => {
    setActiveWorkspace(workspace);
    router.push(`/workspace/${workspace.workspace_id}`);
  };

  const { isMobile } = useSidebar();

  return (
    <>
      <SidebarGroupLabel className="w-full justify-between">
        <span>Workspace</span>
        <button
          onClick={onOpen}
          className=" flex size-5 items-center justify-center rounded-full border"
        >
          <Plus className=" size-3.5" />
        </button>
      </SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size={"lg"}
                className=" data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground bg-gray-10 mt-2"
              >
                {activeWorkspace ? (
                  <>
                    <div className=" flex aspect-square size-8 items-center font-semibold justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      {activeWorkspace.name.split(" ")?.[0].charAt(0)}
                    </div>
                    <div className=" grid flex-1 text-left text-sm leading-tight">
                      <span className=" truncate font-semibold">
                        {activeWorkspace.name}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className=" grid flex-1/2 text-left text-sm leading-tight">
                    No Workspace selected
                  </div>
                )}
                <ChevronDown className=" ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="min-w-56 rounded-lg bg-muted"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Workspaces
              </DropdownMenuLabel>
              {isPending ? <Loader className="w-5 h-5 animate-spin" /> : null}

              {workspaces?.map((workspace) => (
                <DropdownMenuItem
                  key={workspace.workspace_id}
                  onClick={() => onSelect(workspace)}
                  className="gap-2 p-2 !cursor-pointer"
                >
                  <div className=" flex flex-col gap-2 text-xs">
                    <div className=" flex justify-between items-center">
                      <div className=" flex gap-2 items-center">
                        <div className="flex size-6 items-center justify-center rounded-sm border">
                          {workspace?.name?.split(" ")?.[0]?.charAt(0)}
                        </div>
                        <p>{workspace.name}</p>
                      </div>

                      {workspace.workspace_id === workspaceId && (
                        <DropdownMenuShortcut className="tracking-normal !opacity-100">
                          <Check className="w-4 h-4" />
                        </DropdownMenuShortcut>
                      )}
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onOpen}
                className="gap-2 p-2 border-none !cursor-pointer"
              >
                <Button
                  className="w-full text-start"
                  variant={"outline"}
                  size={"sm"}
                >
                  <Plus size={16} />
                  Add Workspace
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
