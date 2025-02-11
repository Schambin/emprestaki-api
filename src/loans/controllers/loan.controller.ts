import { Request, Response } from 'express';
import { LoanService } from '../services/loan.service';
import { LoanLimitExceededError, UnpaidFinesError } from '../errors/loan.errors';

export class LoanController {
    private loanService = new LoanService();

    async createLoan(req: Request, res: Response) {
        try {
            const loan = await this.loanService.createLoan(req.body.user.id, req.body.bookId)
            res.status(201).json({ loan })
        } catch (error) {
            this.handleLoanError(error, res);
        }
    }

    async returnBook(req: Request, res: Response) {
        try {
            const loanId = parseInt(req.params.id);
            const updatedLoan = await this.loanService.returnLoan(loanId);
            res.json({ updatedLoan })
        } catch (error) {
            this.handleLoanError(error, res);
        }
    }

    async getUserLoans(req: Request, res: Response) {
        try {
            const loans = await this.loanService.getUserLoans(req.body.user.id);
            res.json({ loans });
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve loans' });
        }
    }

    async getOverdueLoans(req: Request, res: Response) {
        try {
            const loans = await this.loanService.getOverdueLoans();
            res.json({ loans });
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve overdue loans' });
        }
    }

    private handleLoanError(error: unknown, res: Response) {
        const statusMap = new Map<string, number>([
            [LoanLimitExceededError.name, 400],
            [UnpaidFinesError.name, 403],
        ]);

        const message = error instanceof Error ? error.message : 'Loan operation failed';
        const errorName = error instanceof Error ? error.constructor.name : 'UnknownError';
        const status = statusMap.get(errorName) ?? 400;

        //big fucking if 
        // const status = error instanceof LoanLimitExceededError ? 400 :error instanceof UnpaidFinesError ? 403 : 400;

        res.status(status).json({ error: message });
    }
};