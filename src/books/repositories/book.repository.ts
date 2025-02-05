import { Prisma } from "@prisma/client";
import prisma from "../../prisma/client";

export class BookRepository {
    async create(data: Prisma.BookCreateInput) {
        return prisma.book.create({ data });
    }

    async findMany(search?: string) {
        return prisma.book.findMany({
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
        return prisma.book.findUnique({
            where: { id }
        });
    }
}