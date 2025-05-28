import { Roles } from "../enums/role.enum";
import { TaskStatusEnum } from "../enums/task.enum";
import { BadRequestException, NotFoundException } from "../utils/app-error";
import { prisma } from "../utils/prisam";
import { generateInviteCode } from "../utils/uuid";

export const createWorksapceService = async (
  userId: string,
  body: {
    name: string;
    description?: string | undefined;
  }
) => {
  const { name, description } = body;

  const user = await prisma.user.findFirst({ where: { user_id: userId } });

  if (!user) {
    throw new NotFoundException("User not found");
  }

  const ownerRole = await prisma.role.findFirst({
    where: { name: Roles.OWNER },
  });

  if (!ownerRole) {
    throw new NotFoundException("Owner role not found");
  }

  const workspace = await prisma.workspace.create({
    data: {
      name: name,
      description: description,
      owner_id: user.user_id,
      invite_code: generateInviteCode(),
    },
  });

  await prisma.member.create({
    data: {
      user_id: user.user_id,
      workspace_id: workspace.workspace_id,
      role_id: ownerRole.id,
      joined_at: new Date(),
    },
  });

  await prisma.user.update({
    where: {
      user_id: userId,
    },
    data: {
      current_workspace: workspace.workspace_id,
    },
  });

  return { workspace };
};

export const getAllWorkspaceUserIsMemberService = async (userId: string) => {
  const memberships = await prisma.member.findMany({
    where: { user_id: userId },
    include: {
      workspace: true,
    },
  });

  const worksapces = memberships.map((membership) => membership.workspace_id);

  return { worksapces };
};

export const getWorksapceByIdService = async (workspaceId: string) => {
  const workspace = await prisma.workspace.findFirst({
    where: { workspace_id: workspaceId },
  });

  if (!workspace) {
    throw new NotFoundException("Workspace not found");
  }

  const members = await prisma.member.findMany({
    where: { workspace_id: workspaceId },
    include: {
      role: true,
    },
  });

  const worksapceWithMembers = {
    ...workspace,
    members,
  };
  return {
    workspace: worksapceWithMembers,
  };
};

export const getWorkspaceMembersService = async (worksaceId: string) => {
  const members = await prisma.member.findFirst({
    where: { workspace_id: worksaceId },
    include: {
      user: {
        select: {
          name: true,
          profile_picture: true,
          password: false,
        },
      },
      role: {
        select: {
          name: true,
        },
      },
    },
  });

  const roles = await prisma.role.findMany({
    select: {
      name: true,
      id: true,
    },
  });

  return { members, roles };
};

export const getWorkspaceAnaylticsService = async (worksapceId: string) => {
  const currentDate = new Date();

  const totalTask = await prisma.task.count({
    where: { workspace_id: worksapceId },
  });

  const overDueTasks = await prisma.task.count({
    where: {
      workspace_id: worksapceId,
      dueDate: { lt: currentDate },
      status: { not: TaskStatusEnum.DONE },
    },
  });

  const completedTasks = await prisma.task.count({
    where: {
      workspace_id: worksapceId,
      status: TaskStatusEnum.DONE,
    },
  });
  const anayltics = {
    totalTask,
    overDueTasks,
    completedTasks,
  };

  return { anayltics };
};

export const changeMemberRoleService = async (
  workspaceId: string,
  memberId: string,
  roleId: string
) => {
  const workspace = await prisma.workspace.findUnique({
    where: { workspace_id: workspaceId },
  });

  if (!workspace) {
    throw new NotFoundException("Workspace not found");
  }

  const role = await prisma.role.findUnique({
    where: {
      id: roleId,
    },
  });

  if (!role) {
    throw new NotFoundException("Role not found");
  }

  const member = await prisma.member.findFirst({
    where: {
      user_id: memberId,
      workspace_id: workspaceId,
    },
  });

  if (!member) {
    throw new Error("Member not found in the workspace");
  }

  const updatedMember = await prisma.member.update({
    where: {
      member_id: member.member_id,
    },
    data: {
      role_id: roleId,
    },
  });

  return { updatedMember };
};

export const updateWorkspaceByIdService = async (
  workspaceId: string,
  name: string,
  description?: string
) => {
  const workspace = await prisma.workspace.findFirst({
    where: { workspace_id: workspaceId },
  });

  if (!workspace) {
    throw new NotFoundException("Workspace not found");
  }

  const updatedWorksapce = await prisma.workspace.update({
    where: { workspace_id: workspaceId },
    data: {
      name: name || workspace.name,
      description: description || workspace.description,
    },
  });

  return { workspace: updatedWorksapce };
};

export const deleteWorkspaceService = async (
  workspaceId: string,
  userId: string
) => {
  return prisma.$transaction(async (tx) => {
    const workspace = await tx.workspace.findFirst({
      where: { workspace_id: workspaceId },
    });

    if (workspace?.owner_id.toString() !== userId) {
      throw new BadRequestException(
        "You are not authrized to delete this workspace"
      );
    }

    const user = await prisma.user.findFirst({ where: { user_id: userId } });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    await prisma.project.deleteMany({ where: { workspace_id: workspaceId } });
    await prisma.task.deleteMany({ where: { workspace_id: workspaceId } });

    await prisma.member.deleteMany({
      where: { workspace_id: workspaceId },
    });

    if (user?.current_workspace === workspaceId) {
      await tx.user.update({
        where: { user_id: userId },
        data: { current_workspace: null },
      });
    }
    await tx.workspace.delete({ where: { workspace_id: workspaceId } });

    return { currentWorkspace: user.current_workspace };
  });
};
