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

    async deleteBook(id: number) {
        return this.bookRepository.deleteBook(id)
    }
}