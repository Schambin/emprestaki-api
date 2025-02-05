import { Request, Response } from 'express';
import { LoanService } from '../loans/services/loan.service';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { CreateLoanDto } from '../loans/dtos/create-loan.dto';
import { validateRequest } from '../middleware/validate.middleware';

export class LoanController {
    private loanService = new LoanService();

    async createLoan(req: Request, res: Response) {
        try {
            const loan = await this.loanService.createLoan(req.user.id, req.body.bookId);
            res.status(201).json(loan);
        } catch (error) {
            res.status(400).json({
                error: error instanceof Error ? error.message : 'Loan creation failed'
            });
        }
    }

    async returnBook(req: Request, res: Response) {
        try {
            const loanId = parseInt(req.params.id);
            const updatedLoan = await this.loanService.returnLoan(loanId);
            res.json(updatedLoan);
        } catch (error) {
            res.status(400).json({
                error: error instanceof Error ? error.message : 'Return failed'
            });
        }
    }

    async getUserLoans(req: Request, res: Response) {
        try {
            const loans = await this.loanService.getUserLoans(req.user.id);
            res.json(loans);
        } catch (error) {
            res.status(500).json({
                error: 'Failed to retrieve loans'
            });
        }
    }

    // Admin-only endpoint
    async getOverdueLoans(req: Request, res: Response) {
        try {
            const loans = await this.loanService.getOverdueLoans();
            res.json(loans);
        } catch (error) {
            res.status(500).json({
                error: 'Failed to retrieve overdue loans'
            });
        }
    }
}

export const loanRoutes = (router: import('express').Router) => {
    const controller = new LoanController();

    router.post('/loans',
        authenticate,
        validateRequest(CreateLoanDto),
        controller.createLoan
    );

    router.patch('/loans/:id/return',
        authenticate,
        controller.returnBook
    );

    router.get('/loans/me',
        authenticate,
        controller.getUserLoans
    );

    router.get('/loans/overdue',
        authenticate,
        authorize(['ADMINISTRADOR']),
        controller.getOverdueLoans
    );

    return router;
};