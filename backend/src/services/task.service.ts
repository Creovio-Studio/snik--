import { Prisma, TaskStatus } from "@prisma/client";
import {
  TaskPriorityEnum,
  TaskPriorityEnumType,
  TaskStatusEnum,
  TaskStatusEnumType,
} from "../enums/task.enum";
import { BadRequestException, NotFoundException } from "../utils/app-error";
import { prisma } from "../utils/prisam";
import { generateTaskCode } from "../utils/uuid";

export const createTaskService = async (
  worksapceId: string,
  projectId: string,
  userId: string,
  body: {
    title: string;
    description?: string;
    priority: TaskPriorityEnumType;
    status: TaskStatusEnumType;
    assignedTo?: string | null;
    dueDate?: string;
  }
) => {
  const { title, description, priority, status, assignedTo, dueDate } = body;

  const project = await prisma.project.findFirst({
    where: { project_id: projectId },
  });

  if (!project || project.workspace_id.toString() !== worksapceId.toString()) {
    throw new NotFoundException(
      "Project not found or does not belong to this workspace"
    );
  }

  if (assignedTo) {
    const isAssignedUserMember = await prisma.member.findFirst({
      where: {
        user_id: assignedTo,
        workspace_id: worksapceId,
      },
    });

    if (!isAssignedUserMember) {
      throw new Error("Assigned user is not a member of this workspace.");
    }
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      priority: priority || TaskPriorityEnum.MEDIUM,
      status: status || TaskStatusEnum.TODO,
      assigned_to: assignedTo,
      created_by: userId,
      task_code: generateTaskCode(),
      workspace_id: worksapceId,
      project_id: projectId,
      dueDate,
    },
  });
  return { task };
};

export const updateTaskService = async (
  worksapceId: string,
  projectId: string,
  taskId: string,
  body: {
    title: string;
    description?: string;
    priority: TaskPriorityEnumType;
    status: TaskStatusEnumType;
    assignedTo?: string | null;
    dueDate?: string;
  }
) => {
  const project = await prisma.project.findFirst({
    where: { project_id: projectId },
  });

  if (!project || project.workspace_id.toString() !== worksapceId.toString()) {
    throw new NotFoundException(
      "Project not found or does not belong to this workspace"
    );
  }

  const taskUpdateData: any = {
    title: body.title,
    priority: body.priority,
    status: body.status,
  };

  if (body.description !== undefined) {
    taskUpdateData.description = body.description;
  }

  if (body.assignedTo !== undefined) {
    taskUpdateData.assigned_to = body.assignedTo;
  }

  if (body.dueDate !== undefined) {
    taskUpdateData.dueDate = new Date(body.dueDate);
  }

  const updateTask = await prisma.task.update({
    where: {
      task_id: taskId,
    },
    data: taskUpdateData,
  });
  if (!updateTask) {
    throw new BadRequestException("Failed to update task");
  }

  return { updateTask };
};

export const getAllTaskService = async (
  workspaceId: string,
  filters: {
    projectId?: string;
    status?: string[];
    priority?: string[];
    assignedTo?: string[];
    keyword?: string;
    dueDate?: string;
  },
  pagination: {
    pageSize: number;
    pageNumber: number;
  }
) => {
  const { pageNumber, pageSize } = pagination;
  const skip = (pageNumber - 1) * pageSize;

  const where: Prisma.TaskWhereInput = {
    workspace_id: workspaceId,

    ...(filters.projectId && {
      project_id: filters.projectId,
    }),

    ...(filters.status?.length && {
      status: { in: filters.status as any },
    }),

    ...(filters.priority?.length && {
      priority: { in: filters.priority as any },
    }),

    ...(filters.assignedTo?.length && {
      assigned_to: { in: filters.assignedTo },
    }),

    ...(filters.keyword && {
      title: {
        contains: filters.keyword,
        mode: "insensitive",
      },
    }),

    ...(filters.dueDate && {
      dueDate: {
        equals: new Date(filters.dueDate),
      },
    }),
  };

  const [tasks, totalCount] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { created_at: "desc" },
      include: {
        assignee: {
          select: {
            user_id: true,
            name: true,
            profile_picture: true,
          },
        },
        project: {
          select: {
            project_id: true,
            name: true,
            emoji: true,
          },
        },
      },
    }),

    prisma.task.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    tasks,
    pagination: {
      pageSize,
      pageNumber,
      totalCount,
      totalPages,
      skip,
    },
  };
};

export const getTaskByIdService = async (
  workspaceId: string,
  projectId: string,
  taskId: string
) => {
  const project = await prisma.project.findFirst({
    where: { project_id: projectId },
  });

  if (!project || project.workspace_id.toString() !== workspaceId.toString()) {
    throw new NotFoundException(
      "Project not found or does not belong to this workspace"
    );
  }

  const task = await prisma.task.findFirst({
    where: {
      task_id: taskId,
      workspace_id: workspaceId,
      project_id: projectId,
    },
    include: {
      assignee: {
        select: {
          user_id: true,
          name: true,
          profile_picture: true,
          password: true,
        },
      },
    },
  });

  if (!task) {
    throw new NotFoundException("Task not found.");
  }

  return task;
};

export const deleteTaskService = async (
  worksapceId: string,
  taskId: string
) => {
  const task = await prisma.task.delete({
    where: {
      task_id: taskId,
      workspace_id: worksapceId,
    },
  });

  if (!task) {
    throw new NotFoundException(
      "Task not found or does not belong to the specified workspace"
    );
  }

  return;
};
