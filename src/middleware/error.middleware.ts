import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/http.errors';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({
            error: {
                message: err.message,
                code: err.name,
                details: 'details' in err ? err.details : undefined
            }
        });
    }

    console.error(err.stack);
    res.status(500).json({
        error: {
            message: 'Internal Server Error',
            code: 'INTERNAL_SERVER_ERROR'
        }
    });
};