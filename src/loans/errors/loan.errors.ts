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