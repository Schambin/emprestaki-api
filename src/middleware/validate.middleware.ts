import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { BadRequestError } from '../errors/http.errors';

export const validateRequest = (schema: z.ZodSchema<any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await schema.safeParseAsync(req.body);

            if (!result.success) {
                const formattedErrors = result.error.errors.map(error => ({
                    path: error.path.join('.'),
                    message: error.message
                }));

                throw new BadRequestError('Validation failed', formattedErrors);
            }

            req.body = result.data;
            next();
        } catch (error) {
            next(error);
        }
    };  
};

export const validateBookId = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const bookId = parseInt(req.params.id);

    if (isNaN(bookId)) {
        throw new BadRequestError('Invalid book ID format');
    }

    next();
};