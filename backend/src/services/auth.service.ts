import { AccountProvider } from "@prisma/client";
import { BadRequestException, NotFoundException } from "../utils/app-error";
import { comapreValue, hashValue } from "../utils/bcrypt";
import { prisma } from "../utils/prisam";
import { generateInviteCode, generateRandomPassword } from "../utils/uuid";
import { Roles } from "../enums/role.enum";
import { setJWT } from "../utils/set-jwt";
import { Response } from "express";
import { getEmailName } from "../utils/get-email-name";

export const registerUserService = async (body: {
  email: string;
  name: string;
  password: string;
}) => {
  const { email, name, password } = body;
  try {
    return prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findFirst({ where: { email } });

      if (existingUser) throw new BadRequestException("Email already exists");

      const hashedPassword = await hashValue(password);

      const user = await tx.user.create({
        data: { email, name, password: hashedPassword },
      });

      await tx.account.create({
        data: {
          user_id: user.user_id,
          provider: AccountProvider.EMAIL,
          provider_id: email,
        },
      });

      const workspace = await tx.workspace.create({
        data: {
          name: `My Workspace`,
          description: `Workspace created for ${user.name}`,
          owner_id: user.user_id,
          invite_code: generateInviteCode(),
        },
      });

      const ownerRole = await tx.role.findFirst({
        where: { name: Roles.OWNER },
      });

      if (!ownerRole) throw new NotFoundException("Owner role not found");

      await tx.member.create({
        data: {
          user_id: user.user_id,
          workspace_id: workspace.workspace_id,
          role_id: ownerRole.id,
          joined_at: new Date(),
        },
      });

      await tx.user.update({
        where: {
          user_id: user.user_id,
        },
        data: {
          current_workspace: workspace.workspace_id,
        },
      });

      return { userId: user.user_id, workspaceId: workspace.workspace_id };
    });
  } catch (error) {
    throw error;
  }
};

export const loginUserService = async (body: {
  email: string;
  password: string;
}) => {
  const { email, password } = body;
  try {
    return prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findFirst({ where: { email } });

      if (!existingUser) throw new BadRequestException("User not Found");

      if (!comapreValue(password, existingUser.password))
        throw new BadRequestException("Wrong Password");

      return {
        user_id: existingUser.user_id,
        current_workspace: existingUser.current_workspace,
      };
    });
  } catch (error) {
    throw error;
  }
};

export const googleAuthService = async (
  body: { email: string },
  res: Response
) => {
  const { email } = body;

  try {
    return prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findFirst({ where: { email } });
      if (existingUser) {
        setJWT(res, existingUser.user_id);
        return { user: { current_workspace: existingUser.current_workspace } };
      } else {
        const name = await getEmailName(email);
        const password = await generateRandomPassword();
        const { userId, workspaceId } = await registerUserService({
          email,
          name,
          password,
        });
        setJWT(res, userId);
        return {
          user: {
            current_workspace: workspaceId,
          },
        };
      }
    });
  } catch (error) {
    throw error;
  }
};
