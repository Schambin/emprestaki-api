export class LoanLimitExceededError extends Error {
    constructor() {
        super('Maximum of 3 active loans allowed');
        this.name = 'LoanLimitExceededError';
    }
}

export class UnpaidFinesError extends Error {
    constructor() {
        super('Cannot borrow books with unpaid fines');
        this.name = 'UnpaidFinesError';
    }
}

export class BookNotAvailableError extends Error {
    constructor(bookId: number) {
        super(`Book with ID ${bookId} is not available`);
        this.name = 'BookNotAvailableError';
    }
}