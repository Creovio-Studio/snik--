import { z } from "zod";

export const nameSchema = z
  .string()
  .trim()
  .min(1, { message: "name is required" });

export const descriptionsSchema = z.string().trim().optional();

export const workspaceIdSchema = z
  .string()
  .trim()
  .min(1, { message: "Workspace ID is required" });

export const changeRoleSchema = z.object({
  role_id: z.string().trim().min(1),
  member_id: z.string().trim().min(1),
});

export const createWorkspaceSchema = z.object({
  name: nameSchema,
  description: descriptionsSchema,
});

export const updateWorkspaceSchema = z.object({
  name: nameSchema,
  description: descriptionsSchema,
});
