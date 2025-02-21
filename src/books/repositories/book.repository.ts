import { DatabaseError } from "../../errors/http.errors";
import { Prisma, PrismaClient } from "@prisma/client";
import prisma from "../../prisma/client";

export class BookRepository {
    private prisma: PrismaClient = prisma;
    private buildSearchWhereClause(search: string): Prisma.BookWhereInput {
        return {
            OR: [
                { title: { contains: search, mode: "insensitive" } },
                { author: { contains: search, mode: "insensitive" } },
                { category: { contains: search, mode: "insensitive" } }
            ]
        };
    }

    private handleDatabaseError(error: unknown, context: string): never {
        console.error(`${context}:`, error);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            switch (error.code) {
                case "P2002":
                    throw new DatabaseError("Book with this title already exists");
                case "P2025":
                    throw new DatabaseError("Book not found");
                default:
                    throw new DatabaseError("Database operation failed");
            }
        }
        throw new DatabaseError(context)
    }

    async create(data: Prisma.BookCreateInput) {
        try {
            return await this.prisma.book.create({ data });
        } catch (error) {
            this.handleDatabaseError(error, "Failed To Create Book")
        }
    }

    async findMany(search?: string) {
        try {
            return await this.prisma.book.findMany({
                where: search ? this.buildSearchWhereClause(search) : undefined
            });
        } catch (error) {
            this.handleDatabaseError(error, "Failed to fetch books");
        }
    }

    async findUnique(id: number) {
        try {
            return await this.prisma.book.findUnique({ where: { id } });
        } catch (error) {
            this.handleDatabaseError(error, `Failed to find book ${id}`);
        }
    }

    async updateBook(id: number, data: Prisma.BookUpdateInput) {
        try {
            return await this.prisma.book.update({
                where: { id },
                data
            });
        } catch (error) {
            this.handleDatabaseError(error, `Failed to update book ${id}`);
        }
    }

    async deleteBook(id: number) {
        try {
            return await this.prisma.book.delete({ where: { id } });
        } catch (error) {
            this.handleDatabaseError(error, `Failed to delete book ${id}`);
        }
    }
}