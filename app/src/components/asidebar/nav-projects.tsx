import useWorkspaceId from "@/hooks/use-workspace";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import useCreateProjcetDialog from "@/hooks/use-create-project-dialog";
import useConfirmDialog from "@/hooks/use-confirm-dialog";
import { useState } from "react";
import { deleteProjectMutationFn } from "@/lib/api";
import useGetProjectsInWorkspaceQuery from "@/hooks/api/use-get-projects";
import { PaginationType } from "@/types/api.type";
import { toast } from "sonner";
import PermissionsGuard from "../resuable/permission-guard";
import { Permissions } from "@/constant";
import { Folder, Loader, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ConfirmDialog } from "../resuable/confirm-dialog";

export function NavProjects() {
  const router = useRouter();

  const pathname = usePathname();
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  const { isMobile } = useSidebar();
  const { onOpen } = useCreateProjcetDialog();
  const { context, open, onOpenDialog, onCloseDialog } = useConfirmDialog();

  const [pageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: deleteProjectMutationFn,
  });

  const { data, isPending, isFetching } = useGetProjectsInWorkspaceQuery({
    workspace_id: workspaceId,
    page_number: pageNumber,
    page_size: pageSize,
  });

  const projects = data?.projects || [];
  const pagination = data?.pagination || ({} as PaginationType);
  const hasMore = pagination.total_pages > pageNumber;

  const fetchNextPage = () => {
    if (!hasMore || isFetching) return;
    setPageSize((prev) => prev + 5);
  };

  const handleConfirm = () => {
    if (!context) return;

    mutate(
      { workspace_id: workspaceId, project_id: context.project_id },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: ["allprojects", workspaceId],
          });

          toast.success("Success", { description: data.message });
          router.push(`/workspace/${workspaceId}`);
          setTimeout(() => {
            onCloseDialog();
          }, 100);
        },
        onError: (error) => {
          toast.error("Error", {
            description: error.message,
          });
        },
      }
    );
  };

  return (
    <>
      <SidebarGroup className=" group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel className=" w-full justify-between pr-0">
          <span>Projects</span>
          <PermissionsGuard requiredPermission={"CREATE_PROJECT"}>
            <button
              onClick={onOpen}
              type="button"
              className=" flex size-5 justify-center items-center rounded-full border"
            >
              <Plus className=" size-3.5" />
            </button>
          </PermissionsGuard>
        </SidebarGroupLabel>
        <SidebarMenu className=" h-[320px] scrollbar overflow-y-auto pb-2">
          {isPending ? (
            <Loader className=" w-5 h-5 animate-spin place-self-center" />
          ) : null}
          {!isPending && projects.length === 0 ? (
            <>
              <div className=" pl-3">
                <p className=" text-xs text-muted-foreground">
                  There is no projects in this workspace yet. Projects you
                  create will show up here.
                </p>
                <PermissionsGuard
                  requiredPermission={Permissions.CREATE_PROJECT}
                >
                  <Button
                    onClick={onOpen}
                    variant={"link"}
                    type="button"
                    className="h-0 p-0 text-[13px] underline font-semibold mt-4"
                  >
                    Create a Project
                  </Button>
                </PermissionsGuard>
              </div>
            </>
          ) : (
            projects.map((project) => {
              const projectUrl = `/workspace/${workspaceId}/project/${project.project_id}`;
              return (
                <SidebarMenuItem key={project.project_id}>
                  <SidebarMenuButton asChild isActive={projectUrl === pathname}>
                    <Link href={projectUrl}>
                      {project.emoji}
                      <span>{project.name}</span>
                    </Link>
                  </SidebarMenuButton>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                      className=" w-48 rounded-lg"
                    >
                      <DropdownMenuItem onClick={() => router.push(projectUrl)}>
                        <Folder className="text-muted-foreground" />
                        <span>View Project</span>
                      </DropdownMenuItem>
                      <PermissionsGuard
                        requiredPermission={Permissions.DELETE_PROJECT}
                      >
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          disabled={isLoading}
                          onClick={() => onOpenDialog(project)}
                        >
                          <Trash2 className=" text-muted-foreground" />
                          <span>Delete Project</span>
                        </DropdownMenuItem>
                      </PermissionsGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              );
            })
          )}

          {hasMore && (
            <SidebarMenuItem>
              <SidebarMenuButton
                className=" text-sidebar-foreground/70"
                disabled={isFetching}
                onClick={fetchNextPage}
              >
                <MoreHorizontal className=" text-sidebar-foreground/70" />
                <span>{isFetching ? "Loading>..." : "More"}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroup>

      <ConfirmDialog
        isOpen={open}
        isLoading={isLoading}
        onClose={onCloseDialog}
        onConfirm={handleConfirm}
        title="Delete Project"
        description={`Are you sure you want to delete ${
          context?.name || "this item"
        }? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}
