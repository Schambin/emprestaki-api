import { LoanRepository } from "../repositories/loan.repository";
import { BookService } from "./book.service";
import { UserService } from "./user.service";
import { calculateDueDate, calculateFine } from "../utils/loan.utils";
import { LoanLimitExceededError, UnpaidFinesError } from "../errors/loan.errors";

export class LoanService {
    constructor(
        private loanRepository = new LoanRepository(),
        private bookService = new BookService(),
        private userService = new UserService()
    ) { }

    async createLoan(userId: number, bookId: number) {
        await this.validateLoanCreation(userId, bookId);

        const loan = await this.loanRepository.create({
            user: { connect: { id: userId } },
            book: { connect: { id: bookId } },
            checkoutDate: new Date(),
            dueDate: calculateDueDate(),
            fineAmount: 0,
            paid: false
        });

        await this.bookService.updateBookStatus(bookId, 'RENTED');

        return loan;
    }

    private async validateLoanCreation(userId: number, bookId: number) {
        const activeLoans = await this.loanRepository.findActiveLoansByUser(userId);
        if (activeLoans.length >= 3) {
            throw new LoanLimitExceededError();
        }

        const hasUnpaidFines = await this.userService.hasUnpaidFines(userId);
        if (hasUnpaidFines) {
            throw new UnpaidFinesError();
        }

        const isAvailable = await this.bookService.isBookAvailable(bookId);
        if (!isAvailable) {
            throw new Error('Book is not available for loan');
        }
    }

    async returnLoan(loanId: number) {
        const loan = await this.loanRepository.findById(loanId);
        if (!loan) throw new Error('Loan not found');
        if (loan.returnDate) throw new Error('Book already returned');

        const updatedData: any = {
            returnDate: new Date(),
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
}