import { BookStatus } from "@prisma/client";
import { BookRepository } from "../repositories/book.repository";
import { CreateBookInput, UpdateBookInput } from "../types/book";
import { BadRequestError, DatabaseError, NotFoundError } from "../../errors/http.errors";

export class BookService {
    constructor(private bookRepository = new BookRepository()) { }

    async createBook(data: CreateBookInput) {
        return this.bookRepository.create(data);
    }

    async listBooks(search?: string) {
        return this.bookRepository.findMany(search);
    }

    async getBookById(id: number) {
        const book = await this.bookRepository.findUnique(id);
        if (!book) {
            throw new NotFoundError('Book');
        }
        return {
            book
        };
    }

    async updateBook(id: number, data: UpdateBookInput) {
        try {

            const book = await this.bookRepository.updateBook(id, data);
            if (!book) throw new NotFoundError('Book');
            return { book };

        } catch (error) {
            
            if(error instanceof DatabaseError) {
                throw new BadRequestError(error.message);
            }

        }
    }

    async updateBookStatus(bookId: number, status: BookStatus) {
        return this.updateBook(bookId, { status });
    }

    async isBookAvailable(bookId: number) {
        const book = await this.bookRepository.findUnique(bookId);
        return !!book && book.status === 'AVAILABLE'
    }

    async deleteBook(id: number) {
        const book = await this.bookRepository.deleteBook(id)
        if (!book) throw new NotFoundError('Book');
        return { book }
    }
}