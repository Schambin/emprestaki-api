import { Role } from "@prisma/client";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum: [LEITOR, ADMINISTRADOR]
 */
export type SafeUser = {
    id: number,
    name: string,
    email: string,
    role: Role,
};