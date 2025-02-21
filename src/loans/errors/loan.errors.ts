import { HttpError } from '../../errors/http.errors';

export class LoanLimitExceededError extends HttpError {
    constructor(maxLoans = 3) {
        super(400, `You can't have more than ${maxLoans} active loans`);
    }
}

export class UnpaidFinesError extends HttpError {
    constructor() {
        super(403, 'Please pay your outstanding fines before borrowing');
    }
}

export class BookNotAvailableError extends HttpError {
    constructor(bookId: number) {
        super(409, `Book #${bookId} is currently unavailable`);
    }
}