import { z } from "zod";

export const userFormSchema = z.object({
  name: z.string().min(1, "You must enter a name"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(36, "Password must not exceed 36 characters"),
  role: z.enum(["admin", "volunteer"] as const),
});

export type UserFormData = z.infer<typeof userFormSchema>;
