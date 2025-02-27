import { z } from "zod";
import { createBookSchema } from "./create-book.schema";

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateBookInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: "Novo Título"
 *         author:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           example: "Novo Autor"
 *         category:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           example: "Nova Categoria"
 *         status:
 *           type: string
 *           enum: [AVAILABLE, RENTED]
 *           example: RENTED
 */

export const updateBookSchema = createBookSchema.partial().extend({
  id: z.number().int().positive()
});

export type UpdateBookInput = z.infer<typeof updateBookSchema>;