import { authenticate, authorize } from '../middleware/auth.middleware';
import { LoanController } from '../loans/controllers/loan.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { createLoanSchema, returnLoanSchema } from '../loans/schemas/loan.schema';
import { Router } from 'express';

export const loanRoutes = () => {
    const router = Router();
    const controller = new LoanController();

    router.post('/',
        authenticate,
        authorize(['LEITOR']),
        validateRequest(createLoanSchema),
        controller.createLoan
    );

    router.patch('/:id/return',
        authenticate,
        authorize(['LEITOR']),
        validateRequest(returnLoanSchema),
        controller.returnBook
    );

    router.get('/me',
        authenticate,
        authorize(['LEITOR']),
        controller.getUserLoans
    );

    router.get('/overdue',
        authenticate,
        authorize(['ADMINISTRADOR']),
        controller.getOverdueLoans
    );

    return router;
}