import { z } from 'zod';

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateLoanInput:
 *       type: object
 *       required:
 *         - bookId
 *       properties:
 *         bookId:
 *           type: integer
 *           example: 1
 * 
 *     ReturnLoanInput:
 *       type: object
 *       properties:
 *         returnDate:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00Z"
 * 
 *     Loan:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         userId:
 *           type: integer
 *         bookId:
 *           type: integer
 *         checkoutDate:
 *           type: string
 *           format: date-time
 *         dueDate:
 *           type: string
 *           format: date-time
 *         returnDate:
 *           type: string
 *           format: date-time
 *         fineAmount:
 *           type: number
 *         paid:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         book:
 *           $ref: '#/components/schemas/Book'
 *         user:
 *           $ref: '#/components/schemas/User'
 */

export const createLoanSchema = z.object({
    bookId: z.number({
        required_error: 'Book ID is required',
        invalid_type_error: 'Book ID must be a number'
    }).int().positive()
});

export const returnLoanSchema = z.object({
    returnDate: z.coerce.date().optional(),
    fineAmount: z.number().nonnegative().optional()
}).strict();

export type CreateLoanInput = z.infer<typeof createLoanSchema>;
export type ReturnLoanInput = z.infer<typeof returnLoanSchema>;