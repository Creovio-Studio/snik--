import { z } from "zod";

export const emojiSchema = z.string().trim().optional();
export const nameSchema = z.string().trim().min(1).max(255);
export const descriptionSchema = z.string().trim().min(1).optional();
export const projectIdScehma = z.string().trim().min(1);

export const createProjectScehma = z.object({
  emoji: emojiSchema,
  name: nameSchema,
  description: descriptionSchema,
});

export const updateProjectSceham = z.object({
  emoji: emojiSchema,
  name: nameSchema,
  description: descriptionSchema,
});
