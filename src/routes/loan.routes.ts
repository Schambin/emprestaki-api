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

    router.patch('loans/:id/return',
        authenticate,
        authorize(['LEITOR']),
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
}