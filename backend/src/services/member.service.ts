import { ROLES } from "@prisma/client";
import { ErrorCodeEnum } from "../enums/error-code.enum";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/app-error";
import { prisma } from "../utils/prisam";

export const getMemberRoleInWorkspace = async (
  userId: string,
  workspaceId: string
) => {
  const workspace = await prisma.workspace.findFirst({
    where: { workspace_id: workspaceId },
  });
  if (!workspace) {
    throw new NotFoundException("Workspace not found");
  }

  const member = await prisma.member.findFirst({
    where: {
      user_id: userId,
      workspace_id: workspaceId,
    },
    include: {
      role: true,
    },
  });

  if (!member) {
    throw new UnauthorizedException(
      "You are not a member of this workspace",
      ErrorCodeEnum.ACCESS_UNAUTHORIZED
    );
  }
  const roleName = member.role.name;
  return { role: roleName };
};

export const joinWorkspaceByInviteService = async (
  userId: string,
  inviteCode: string
) => {
  const workspace = await prisma.workspace.findFirst({
    where: { inviteCode },
  });

  const existingMember = await prisma.member.findFirst({
    where: {
      user_id: userId,
    },
  });

  if (existingMember) {
    throw new BadRequestException("You are already a member of this workspace");
  }

  const role = await prisma.role.findFirst({ where: { name: ROLES.MEMBER } });

  if (!role) {
    throw new NotFoundException("Role not found");
  }

  await prisma.member.create({
    data: {
      user_id: userId,
      workspace_id: workspace!.workspace_id,
      role_id: role.id,
      joined_at: new Date(),
    },
  });
  return { workspaceId: workspace!.workspace_id, role: role.name };
};
