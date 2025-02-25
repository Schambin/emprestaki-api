import { CreateLoanInput, ReturnLoanInput } from '../schemas/loan.schema';
import { BadRequestError, NotFoundError } from '../../errors/http.errors';
import { LoanLimitExceededError } from '../../errors/http.errors';
import { UnpaidFinesError } from '../errors/loan.errors';
import { LoanService } from '../services/loan.service';
import { Request, Response } from 'express';
import { SafeUser } from '../../users/types/user';

export class LoanController {
    constructor(private loanService = new LoanService()) {
        this.bindMethods();
    }

    private bindMethods() {
        const methods: Array<keyof LoanController> = [
            'createLoan', 'returnBook', 'getUserLoans',
            'getOverdueLoans', 'getRemainingBalance'
        ];

        methods.forEach(m => {
            this[m] = (this[m] as any).bind(this);
        });
    }

    async createLoan(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user!.id;
            const { bookId } = req.body as CreateLoanInput;

            const loan = await this.loanService.createLoan(userId, { bookId });
            res.status(201).json(loan);
        } catch (error: any) {
            if (error instanceof BadRequestError) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'Failed to create loan' });
        }
    }

    async returnBook(req: Request, res: Response): Promise<void> {
        try {
            const loanId = parseInt(req.params.id);
            const data = req.body as ReturnLoanInput;

            const updatedLoan = await this.loanService.returnLoan(loanId, data);
            res.json(updatedLoan);
        } catch (error: any) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ error: error.message });
                return;
            }
            res.status(400).json({ error: error instanceof Error ? error.message : 'Return failed' });
        }
    }

    async getUserLoans(req: Request, res: Response) {
        const user = req.user;
        req.user = user as SafeUser;

        try {
            const loans = await this.loanService.getUserLoans(req.user.id);
            res.json(loans);
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve loans' });
        }
    }

    async getOverdueLoans(req: Request, res: Response) {
        try {
            const loans = await this.loanService.getOverdueLoans();
            res.json(loans);
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve overdue loans' });
        }
    }

    async getRemainingBalance(req: Request, res: Response) {
        try {
            const loanId = parseInt(req.params.id);
            const remainingLoans = await this.loanService.getRemainingBalance(loanId);
            res.json({ 'Remaining balance': remainingLoans });
        } catch (error) {
            res.status(500).json({ error: 'Failed to retieve balance' });
        }
    }

    private handleLoanError = (error: unknown, res: Response) => {
        const statusMap = new Map<string, number>([
            [LoanLimitExceededError.name, 400],
            [UnpaidFinesError.name, 403],
        ]);

        const message = error instanceof Error ? error.message : 'Loan operation failed';
        const errorName = error instanceof Error ? error.constructor.name : 'UnknownError';
        const status = statusMap.get(errorName) ?? 400;

        res.status(status).json({ error: message });
    }
};