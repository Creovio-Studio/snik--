"use client";

import useWorkspaceId from "@/hooks/use-workspace";
import { getProjectByIdQueryFn } from "@/lib/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import CreateTaskDialog from "../task/create-task-dialog";
import PermissionsGuard from "@/components/resuable/permission-guard";
import { Permissions } from "@/constant";
import EditProjectDialog from "./edit-project-dialog";

const ProjectHeader = () => {
  const param = useParams();
  const projectId = param.projectId as string;
  const workspaceId = useWorkspaceId();

  const {
    data: project,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["singleProject", projectId],
    queryFn: () =>
      getProjectByIdQueryFn({
        workspace_id: workspaceId,
        project_id: projectId,
      }),
    select: (data) => data.project,
    staleTime: Infinity,
    enabled: !!projectId,
    placeholderData: keepPreviousData,
  });

  if (isPending) return <span>Loading...</span>;
  if (isError) return <span>Error occurred</span>;

  const projectEmoji = project?.emoji || "😶‍🌫️";
  const projectName = project?.name || "Untitled project";

  return (
    <div className="flex items-center justify-between space-y-2">
      <div className="flex items-center gap-2">
        <h2 className="flex items-center gap-3 text-xl font-medium truncate tracking-tight">
          <span>{projectEmoji}</span>
          {projectName}
        </h2>
        <PermissionsGuard requiredPermission={Permissions.EDIT_PROJECT}>
          <EditProjectDialog project={project} />
        </PermissionsGuard>
      </div>
      <CreateTaskDialog projectId={projectId} />
    </div>
  );
};

export default ProjectHeader;
