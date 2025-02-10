import { Prisma } from "@prisma/client";
import prisma from "../../prisma/client";

export class LoanRepository {
    async create(data: Prisma.LoanCreateInput){
        return prisma.loan.create({ data });
    }

    async findActiveLoansByUser(userId: number){
        return prisma.loan.findMany({
            where: {
                userId,
                returnDate: null,
            },
            include: { book: true }
        });
    }

    async findById(id: number){
        return prisma.loan.findUnique({
            where: { id },
            include: { book: true, user: true }
        });
    }

    async update(id: number, data: Prisma.LoanUpdateInput){
        return prisma.loan.update({
            where: { id },
            data,
        });
    }

    async findOverdueLoans(){
        return prisma.loan.findMany({
            where: {
                returnDate: null,
                dueDate: { lt: new Date() }
            },
            include: { book: true, user: true }
        });
    }
}