import { Prisma } from "@prisma/client";
import prisma from "../../prisma/client";

export class BookRepository {
    async create(data: Prisma.BookCreateInput) {
        return await prisma.book.create({ data });
    }

    async findMany(search?: string) {
        return await prisma.book.findMany({
            where: {
                OR: search ? [
                    { title: { contains: search, mode: 'insensitive' } },
                    { author: { contains: search, mode: 'insensitive' } },
                    { category: { contains: search, mode: 'insensitive' } }
                ] : undefined
            }
        });
    }

    async findUnique(id: number) {
        return await prisma.book.findUnique({
            where: { id }
        });
    }

    async updateBook(id: number, data: string) {
        try {
            return await prisma.book.update({
                where: { id },
                data
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new Error('Book not found');
                }
            }
            throw new Error('Failed to update book');
        }
    }

    async deleteBook(id: number) {
        try {
            return await prisma.book.delete({
                where: { id },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new Error('Book not found');
                }
            }
            throw new Error('Failed to delete book');
        }
    }
}