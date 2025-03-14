import { z } from "zod";
import { createUserSchema, passwordRegex } from "./create-user.schema";

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateUserInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           minLength: 6
 *           description: Deve conter 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial
 *         role:
 *           type: string
 *           enum: [LEITOR, ADMINISTRADOR]
 * 
 *     UpdateCurrentUserInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           minLength: 6
 *           description: Deve conter 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial
 */
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