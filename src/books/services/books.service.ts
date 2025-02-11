import { BookStatus } from "@prisma/client";
import { BookRepository } from "../repositories/book.repository";
import { CreateBookInput } from "../types/book";

export class BookService {
    private bookRepository: BookRepository;

    constructor() {
        this.bookRepository = new BookRepository();
    }

    async createBook(data: CreateBookInput) {
        return this.bookRepository.create(data);
    }

    async listBooks(search?: string) {
        return this.bookRepository.findMany(search);
    }

    async getBookById(id: number) {
        return this.bookRepository.findUnique(id);
    }

    async updateBook(id: number, data: string) {
        return this.bookRepository.updateBook(id, data);
    }

    async updateBookStatus(bookId: number, status: BookStatus) {
        const book = await this.bookRepository.updateBook(bookId, { status })
        if (!book) {
            throw new Error('Book not found');
        }

        return book;
    }

    async isBookAvailable(bookId: number) {
        const book = await this.bookRepository.findUnique(bookId);
        return !!book && book.status === 'AVAILABLE'
    }

    async deleteBook(id: number) {
        return this.bookRepository.deleteBook(id)
    }
}