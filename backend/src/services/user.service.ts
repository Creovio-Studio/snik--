import { prisma } from "../utils/prisam";

export const getCurrentUserService = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      user_id: userId,
    },
    select: {
      user_id: true,
      name: true,
      current_workspace: true,
      workspaces: true,
    },
  });

  return user;
};
