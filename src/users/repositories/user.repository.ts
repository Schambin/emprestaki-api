import { Prisma, User } from "@prisma/client";
import prisma from "../../prisma/client";
import { DatabaseError } from "../../errors/http.errors";

export class UserRepository {
    async create(data: Prisma.UserCreateInput): Promise<User> {
        try {
            return await prisma.user.create({ data });
        } catch (error) {
            throw new DatabaseError('Failed to create user');
        }
    }

    async findById(id: number): Promise<User | null> {
        try {
            return await prisma.user.findUnique({
                where: {
                    id
                }
            });
        } catch (error) {
            throw new DatabaseError('Failed to find user');
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        try {
            return await prisma.user.findUnique({
                where: {
                    email
                }
            });
        } catch (error) {
            throw new DatabaseError('Failed to find user');
        }
    }

    async findUserByEmail(email: string): Promise<User | null> {
        try {
            return await prisma.user.findUnique({
                where: { email },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    password: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                    deletedAt: true
                }
            });
        } catch (error) {
            throw new DatabaseError('Failed to find user by email');
        }
    }

    async updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User> {
        try {
            return await prisma.user.update({
                where: { id }, data
            });
        } catch (error) {
            throw new DatabaseError('Failed to update user');
        }
    }

    async deleteUser(id: number): Promise<User> {
        try {
            return await prisma.user.delete({
                where: {
                    id
                }
            });
        } catch (error) {
            throw new DatabaseError('Failed to delete user');
        }
    }

    async hasUnpaidFines(userId: number): Promise<boolean> {
        try {
            const unpaidCount = await prisma.loan.count({
                where: {
                    userId,
                    fineAmount: { gt: 0 },
                    paid: false,
                    returnDate: null
                }
            });
            return unpaidCount > 0;
        } catch (error) {
            throw new DatabaseError('Failed to check unpaid fines');
        }
    }
}