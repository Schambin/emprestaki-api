import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/http.errors';
import { ZodError } from 'zod';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let status = 500;
  let message = 'Something went wrong';
  let details: Record<string, unknown> = {};

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

  if (err instanceof HttpError) {
    status = err.statusCode;
    message = err.message;
    if (err.details) details = err.details;
  }

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

  console.error('Unexpected error:', err);
  res.status(500).json({
    error: {
      type: 'InternalServerError',
      message: 'Something went wrong'
    }
  });

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