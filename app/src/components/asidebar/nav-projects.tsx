import useWorkspaceId from "@/hooks/use-workspace";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
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
import { Loader, Plus } from "lucide-react";
import { Button } from "../ui/button";

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
            <></>
          )}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
