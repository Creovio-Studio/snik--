import { z } from "zod";

export const formSchema = z.object({
  email: z
    .string()
    .trim()
    .email("invalid email adress")
    .min(1, "email is required"),
  password: z.string().trim().min(1, "password is required"),
});

export type formSchemaType = z.infer<typeof formSchema>;
