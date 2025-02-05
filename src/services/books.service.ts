import prisma from "../prisma/client";
// import { CreateBookInput } from "../types/book";


export class BookService {
    async createBook(data: CreateBookInput) {
        return prisma.book.create({ data });
    }

    async listBooks(search?: string) {
        return prisma.book.findMany({
            where: {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { author: { contains: search, mode: 'insensitive' } },
                    { category: { contains: search, mode: 'insensitive' } }
                ]
            }
        });
    }
}