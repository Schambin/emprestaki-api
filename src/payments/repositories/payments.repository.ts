import { PrismaClient, Payment, Prisma } from "@prisma/client";
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

    async findUserPayments(
        userId: number,
        filters?: {
            minAmount?: number;
            maxAmount?: number;
            startDate?: Date;
            endDate?: Date;
        },
        pagination?: {
            page: number;
            pageSize: number;
        },
        sort?: {
            field: "amount" | "paymentDate";
            order: "asc" | "desc";
        }
    ): Promise<{ data: Payment[]; total: number }> {
        try {
            const where: Prisma.PaymentWhereInput = { userId };

            if (filters?.minAmount !== undefined || filters?.maxAmount !== undefined) {
                where.amount = {
                    gte: filters.minAmount,
                    lte: filters.maxAmount,
                };
            }

            if (filters?.startDate || filters?.endDate) {
                where.paymentDate = {
                    gte: filters.startDate,
                    lte: filters.endDate,
                };
            }

            const page = pagination?.page || 1;
            const pageSize = pagination?.pageSize || 10;
            const skip = (page - 1) * pageSize;

            const orderBy: Prisma.PaymentOrderByWithRelationInput = {};
            if (sort?.field) {
                orderBy[sort.field] = sort.order || "desc";
            }

            const [data, total] = await Promise.all([
                this.prisma.payment.findMany({
                    where,
                    skip,
                    take: pageSize,
                    orderBy,
                    include: { loan: true },
                }),
                this.prisma.payment.count({ where }),
            ]);

            return { data, total };
        } catch (error) {
            throw new DatabaseError("Failed to fetch user payments");
        }
    }


    async getPaymentsByLoan(loanId: number, options?: Prisma.PaymentFindManyArgs): Promise<Payment[]> {
        return this.findMany({
            ...options,
            where: { ...options?.where, loanId },
        });
    }

    async findMany(
        options: Prisma.PaymentFindManyArgs
    ): Promise<Payment[]> {
        try {
            return await this.prisma.payment.findMany(options);
        } catch (error) {
            throw new DatabaseError("Failed to fetch payments");
        }
    }

    async count(where?: Prisma.PaymentWhereInput): Promise<number> {
        try {
            return await this.prisma.payment.count({ where });
        } catch (error) {
            throw new DatabaseError("Failed to count payments");
        }
    }
}