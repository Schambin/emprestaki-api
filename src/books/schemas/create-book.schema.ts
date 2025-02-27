import { z } from 'zod';

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateBookInput:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - category
 *       properties:
 *         title:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *         author:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *         category:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *         status:
 *           type: string
 *           enum: [AVAILABLE, RENTED]
 *           default: AVAILABLE
 */
export const createBookSchema = z.object({
    title: z.string({
        required_error: 'Title is required',
        invalid_type_error: 'Title must be text'
    })
        .min(2, 'Title must be at least 2 characters')
        .max(100, 'Title cannot exceed 100 characters'),

    author: z.string({
        required_error: 'Author is required',
        invalid_type_error: 'Author name must be text'
    })
        .min(2, 'Author name must be at least 2 characters')
        .max(50, 'Author name cannot exceed 50 characters'),

    category: z.string({
        required_error: 'Category is required',
        invalid_type_error: 'Category must be text'
    })
        .min(2, 'Category must be at least 2 characters')
        .max(50, 'Category cannot exceed 50 characters'),

    status: z.enum(['AVAILABLE', 'RENTED'], {
        errorMap: () => ({ message: 'Status must be AVAILABLE or RENTED' })
    }).default('AVAILABLE')
});

export type CreateBookInput = z.input<typeof createBookSchema>;
export type CreateBookOutput = z.output<typeof createBookSchema>;