export class BadRequestError extends Error {
    public statusCode: number;
    public details?: Record<string, unknown>;

    constructor(message: string = 'Bad Request', details?: Record<string, unknown>) {
        super(message);
        this.name = 'BadRequestError';
        this.statusCode = 400;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}