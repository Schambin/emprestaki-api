import { z } from 'zod';

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