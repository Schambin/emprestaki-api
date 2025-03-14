import { z } from 'zod';

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUserInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - role
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *         email:
 *           type: string
 *         password:
 *           type: string
 *           minLength: 6
 *           maxLength: 50
 *           
 *         role:
 *           type: string
 *           enum: [LEITOR, ADMINISTRADOR]
 *           default: LEITOR
 */

export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;
export const createUserSchema = z.object({
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name cannot exceed 50 characters"),

    email: z.string().email("Invalid email address"),

    password: z.string()
        .min(6, "Password must be at least 6 characters")
        .regex(passwordRegex, {
            message: "Password must contain: 1 uppercase, 1 lowercase, 1 number, 1 special character (!@#$%^&*)"
        }),

    role: z.enum(['LEITOR', 'ADMINISTRADOR']).default('LEITOR')
});

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

export const updateCurrentUserSchema = updateUserSchema.omit({ role: true });

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateCurrentUserInput = z.infer<typeof updateCurrentUserSchema>;