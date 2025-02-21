import { z } from "zod";
import { createUserSchema, passwordRegex } from "./create-user.schema";

export const updateUserSchema = createUserSchema
    .omit({ password: true })
    .extend({
        password: z.string()
            .min(6, "Password must be at least 6 characters")
            .regex(passwordRegex, {
                message: "Password must contain: 1 uppercase, 1 lowercase, 1 number, 1 special character (!@#$%^&*)"
            })
            .optional()
    })
    .partial();

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;