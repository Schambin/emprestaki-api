import { LoanRepository } from "../../loans/repositories/loan.repository";
import { BadRequestError, NotFoundError } from "../../errors/http.errors";
import { PaymentRepository } from "../repositories/payments.repository";

export class PaymentService {
    private paymentRepository = new PaymentRepository();
    private loanRepository = new LoanRepository();

    async createPayment(userId: number, loanId: number, amount: number) {
        if (amount <= 0) {
            throw new BadRequestError("Invalid payment amount");
        }

        const loan = await this.loanRepository.findById(loanId);
        if (!loan || loan.userId !== userId) {
            throw new NotFoundError("Loan not found or does not belong to the user");
        }

        if (loan.fineAmount <= 0) {
            throw new BadRequestError("No fine associated with this loan");
        }

        const existingPayments = await this.paymentRepository.getPaymentsByLoan(loanId);
        const totalPaid = existingPayments.reduce((sum, payment) => sum + payment.amount, 0);
        const remainingBalance = loan.fineAmount - totalPaid;

        if (amount > remainingBalance) {
            throw new BadRequestError(`Payment exceeds remaining balance of $${remainingBalance}`);
        }

        const payment = await this.paymentRepository.createPayment({
            userId,
            loanId,
            amount,
        });

        if (totalPaid + amount >= loan.fineAmount) {
            await this.loanRepository.update(loanId, { paid: true });
        }

        return payment;
    }

    async getPaymentDetails(paymentId: number) {
        console.log("Fetching payment from repository for ID:", paymentId); // Debugging
        const payment = await this.paymentRepository.getPaymentById(paymentId);
        if (!payment) {
            throw new NotFoundError("Payment not found");
        }
        console.log("Payment retrieved:", payment); // Debugging
        return payment;
    }

    async getUserPayments(userId: number) {
        return this.paymentRepository.getPaymentsByUser(userId);
    }

    async getLoanPayments(loanId: number) {
        return this.paymentRepository.getPaymentsByLoan(loanId);
    }
}