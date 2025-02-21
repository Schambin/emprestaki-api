export class HttpError extends Error {
    constructor(
        public readonly statusCode: number,
        message: string,
        public readonly details?: Record<string, unknown>
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class BadRequestError extends HttpError {
    constructor(
        message: string = "Bad request",
        public readonly fields?: Array<{
            path: string;
            message: string
        }>
    ) {
        super(400, message, fields ? { fields } : undefined);
    }
}


export class UnauthorizedError extends HttpError {
    constructor(message = "Unauthorized") {
        super(401, message);
    }
}
export class ForbiddenError extends HttpError {
    constructor(message = "Forbidden") {
        super(403, message);
    }
}

export class NotFoundError extends HttpError {
    constructor(entity: string) {
        super(404, `${entity} not found`);
    }
}

export class ConflictError extends HttpError {
    constructor(message = "Conflict") {
        super(409, message);
    }
}

export class InternalServerError extends HttpError {
    constructor(message = "Internal server error") {
        super(500, message);
    }
}

export class DatabaseError extends HttpError {
    constructor(message: string) {
        super(500, `Database Error: ${message}`);
    }
}

export class LoanLimitExceededError extends HttpError {
    constructor(maxLoans = 3) {
        super(400, `Maximum of ${maxLoans} active loans allowed`, { maxLoans });
    }
}

export class UnpaidFinesError extends HttpError {
    constructor() {
        super(403, "Cannot borrow books with unpaid fines");
    }
}