import { LoanLimitExceededError, UnpaidFinesError, BookNotAvailableError } from "../errors/loan.errors";
import { CreateLoanInput, ReturnLoanInput } from "../schemas/loan.schema";
import { calculateDueDate, calculateFine } from "../utils/loan.utils";
import { LoanRepository } from "../repositories/loan.repository";
import { BookService } from "../../books/services/books.service";
import { UserService } from "../../users/services/user.service";
import { NotFoundError } from "../../errors/http.errors";
import { PaymentRepository } from "../../payments/repositories/payments.repository";

interface LoanUpdateData {
    returnDate: Date;
    fineAmount?: number;
}

export class LoanService {
    constructor(
        private loanRepository = new LoanRepository(),
        private paymentRepository = new PaymentRepository(),
        private bookService = new BookService(),
        private userService = new UserService(),
    ) { }

    async createLoan(userId: number, { bookId }: CreateLoanInput) {
        await this.validateLoanCreation(userId, bookId);

        const loan = await this.loanRepository.create({
            user: { connect: { id: userId } },
            book: { connect: { id: bookId } },
            checkoutDate: new Date(),
            dueDate: calculateDueDate(),
            fineAmount: 0,
            paid: false,
        });

        await this.bookService.updateBookStatus(bookId, 'RENTED');
        return loan;
    }

    private async validateLoanCreation(userId: number, bookId: number) {
        const [activeLoans, hasUnpaidFines, isAvailable] = await Promise.all([
            this.loanRepository.findActiveLoansByUser(userId),
            this.userService.hasUnpaidFines(userId),
            this.bookService.isBookAvailable(bookId)
        ]);

        if (activeLoans.length >= 3) throw new LoanLimitExceededError();
        if (hasUnpaidFines) throw new UnpaidFinesError();
        if (!isAvailable) throw new BookNotAvailableError(bookId);
    }

    async returnLoan(loanId: number, data: ReturnLoanInput) {
        const loan = await this.loanRepository.findById(loanId);
        if (!loan) throw new Error('Loan not found');
        if (loan.returnDate) throw new Error('Book already returned');

        const updatedData: LoanUpdateData = {
            returnDate: new Date()
        };

        if (new Date() > loan.dueDate) {
            updatedData.fineAmount = calculateFine(loan.dueDate);
        }

        const updatedLoan = await this.loanRepository.update(loanId, updatedData);
        await this.bookService.updateBookStatus(loan.bookId, 'AVAILABLE');
        return updatedLoan;
    }

    async getUserLoans(userId: number) {
        return this.loanRepository.findActiveLoansByUser(userId);
    }

    async getOverdueLoans() {
        const loans = await this.loanRepository.findOverdueLoans();
        return loans.map(loan => ({
            ...loan,
            currentFine: calculateFine(loan.dueDate)
        }));
    }

    async getRemainingBalance(loanId: number) {
        const loan = await this.loanRepository.findById(loanId);
        if (!loan) throw new NotFoundError("Loan");

        const payments = await this.paymentRepository.getPaymentsByLoan(loanId);
        const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);

        return loan.fineAmount - totalPaid;
    }
}