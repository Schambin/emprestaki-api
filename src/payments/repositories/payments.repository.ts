import { PrismaClient, Payment } from "@prisma/client";
import { DatabaseError } from "../../errors/http.errors";
import prisma from "../../prisma/client";

export class PaymentRepository {
    private prisma: PrismaClient = prisma;

    async createPayment(data: {
        userId: number;
        loanId: number;
        amount: number;
    }): Promise<Payment> {
        try {
            return await this.prisma.payment.create({
                data: {
                    userId: data.userId,
                    loanId: data.loanId,
                    amount: data.amount,
                },
            });
        } catch (error) {
            throw new DatabaseError("Failed to create payment");
        }
    }

    async getPaymentById(id: number): Promise<Payment | null> {
        try {
            return await this.prisma.payment.findUnique({
                where: { id },
                include: { user: true, loan: true },
            });
        } catch (error) {
            throw new DatabaseError("Failed to fetch payment");
        }
    }

    async getPaymentsByUser(userId: number): Promise<Payment[]> {
        try {
            return await this.prisma.payment.findMany({
                where: { userId },
                include: { loan: true },
            });
        } catch (error) {
            throw new DatabaseError("Failed to fetch user payments");
        }
    }

    async getPaymentsByLoan(loanId: number): Promise<Payment[]> {
        try {
            return await this.prisma.payment.findMany({
                where: { loanId },
                include: { user: true },
            });
        } catch (error) {
            throw new DatabaseError("Failed to fetch loan payments");
        }
    }
}