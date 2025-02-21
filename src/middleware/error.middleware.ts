import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { HttpError } from '../errors/http.errors';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let status = 500;
  let message = 'Something went wrong';
  let details: Record<string, unknown> = {};

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map(error => ({
      path: error.path.join('.'),
      message: error.message
    }));
    return res.status(400).json({
      error: {
        message: 'Validation failed',
        statusCode: 400,
        details: {
          fields: formattedErrors
        },
        timestamp: new Date().toISOString(),
        path: req.originalUrl
      }
    });
  }

  // Handle custom HTTP errors
  if (err instanceof HttpError) {
    status = err.statusCode;
    message = err.message;
    if (err.details) details = err.details;
  }

  // Handle specific error names
  switch (err.name) {
    case 'BookNotAvailableError':
      status = 409;
      message = err.message;
      break;

    case 'UnpaidFinesError':
      status = 403;
      message = err.message;
      break;
  }

  // Log unexpected errors
  if (status === 500) {
    console.error('Unexpected error:', err);
  }

  res.status(status).json({
    error: {
      message,
      ...(Object.keys(details).length > 0 && { details }),
      ...(status === 500 && { stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined }),
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    }
  });
}