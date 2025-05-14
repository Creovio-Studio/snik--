import { NotFoundException } from "../utils/app-error";
import { prisma } from "../utils/prisam";

export const createProjectService = async (
  userId: string,
  workspaceId: string,
  body: {
    emoji?: string;
    name: string;
    description?: string;
  }
) => {
  const project = await prisma.project.create({
    data: {
      created_by: userId,
      workspace_id: workspaceId,
      description: body.description!,
      emoji: body.emoji!,
      name: body.name,
    },
  });

  return { project };
};

export const getProjectsInWorkspaceService = async (
  workspaceId: string,
  pageSize: number,
  pageNumber: number
) => {
  const totalCount = await prisma.project.count({
    where: { workspace_id: workspaceId },
  });

  const skip = (pageNumber - 1) * pageSize;

  const projects = await prisma.project.findMany({
    where: { workspace_id: workspaceId },
    skip: skip,
    include: {
      creator: true,
    },
  });
  const totalPage = Math.ceil(totalCount / pageSize);
  return { projects, totalCount, totalPage, skip };
};

export const getProjectByIdAndWorkspaceIdService = async (
  workspaceId: string,
  projectId: string
) => {
  const project = await prisma.project.findFirst({
    where: {
      project_id: projectId,
      workspace_id: workspaceId,
    },
    select: {
      emoji: true,
      project_id: true,
      name: true,
      description: true,
    },
  });
  if (!project) {
    throw new NotFoundException(
      "Project not found or does not belong to the specified workspace"
    );
  }
  return { project };
};

export const getProjectAnalyticsService = async (
  workspaceId: string,
  projectId: string
) => {
  const project = await prisma.project.findFirst({
    where: { project_id: projectId },
  });
  if (!project || project.workspace_id.toString() != workspaceId.toString()) {
    throw new NotFoundException(
      "Project not found or does not belong to this workspace"
    );
  }

  const currentDate = new Date();

  const [totalTasks, overdueTasks, completedTasks] = await Promise.all([
    prisma.task.count({
      where: { project_id: projectId },
    }),

    prisma.task.count({
      where: {
        project_id: projectId,
        dueDate: { lt: currentDate },
        status: { not: "DONE" },
      },
    }),

    prisma.task.count({
      where: {
        project_id: projectId,
        status: "DONE",
      },
    }),
  ]);

  const analytics = {
    totalTasks,
    overdueTasks,
    completedTasks,
  };
  return { analytics };
};

export const updateProjectService = async (
  workspaceId: string,
  projectId: string,
  body: {
    emoji?: string;
    name: string;
    description?: string;
  }
) => {
  const { name, emoji, description } = body;
  const project = await prisma.project.update({
    where: {
      project_id: projectId,
      workspace_id: workspaceId,
    },
    data: {
      emoji,
      name,
      description,
    },
  });

  if (!project) {
    throw new NotFoundException(
      "Proejct not found or does not belong to the specified workspace"
    );
  }

  return { project };
};

export const deleteProjectService = async (
  workspaceId: string,
  projectId: string
) => {
  const project = await prisma.project.delete({
    where: {
      project_id: projectId,
      workspace_id: workspaceId,
    },
  });

  if (!project) {
    throw new NotFoundException(
      "Proejct not found or does not belong to the specified workspace"
    );
  }
  return { project };
};
