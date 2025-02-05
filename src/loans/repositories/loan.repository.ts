import prisma from "../prisma/client";
import { Loan, Prisma } from "@prisma/client";

export class LoanRepository {
    async create(data: Prisma.LoanCreateInput): Promise<Loan> {
        return prisma.loan.create({ data });
    }

    async findById(id: number): Promise<Loan | null> {
        return prisma.loan.findUnique({
            where: { id },
            include: { book: true, user: true }
        });
    }

    async update(id: number, data: Prisma.LoanUpdateInput): Promise<Loan> {
        return prisma.loan.update({
            where: { id },
            data,
        });
    }

    async findActiveLoansByUser(userId: number): Promise<Loan[]> {
        return prisma.loan.findMany({
            where: {
                userId,
                returnDate: null,
            },
            include: { book: true }
        });
    }

    async findOverdueLoans(): Promise<Loan[]> {
        return prisma.loan.findMany({
            where: {
                returnDate: null,
                dueDate: { lt: new Date() }
            },
            include: { book: true, user: true }
        });
    }
}