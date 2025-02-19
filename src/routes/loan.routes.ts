import { Router } from 'express';
import { LoanController } from '../loans/controllers/loan.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { CreateLoanDto } from '../loans/dtos/loan.dto';

export const loanRoutes = () => {
    const router = Router();
    const controller = new LoanController();

    router.post('/',
        authenticate,
        authorize(['LEITOR']),
        validateRequest(CreateLoanDto),
        controller.createLoan
    );

    router.patch('/:id/return',
        authenticate,
        authorize(['LEITOR']),
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