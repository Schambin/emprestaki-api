import { NextFunction, Request, Response } from "express";
import { BookService } from "../services/books.service";
import { CreateBookDto } from "../dtos/createBook.dto";

export class BookController {
    constructor(private bookService = new BookService()) {
        this.createBook = this.createBook.bind(this) as
            (req: Request, res: Response) => Promise<void>;

        this.listBooks = this.listBooks.bind(this) as
            (req: Request, res: Response) => Promise<void>;

        this.getBookById = this.getBookById.bind(this) as
            (req: Request, res: Response, next: NextFunction) => Promise<void>;

        this.updateBook = this.updateBook.bind(this) as
            (req: Request, res: Response) => Promise<void>;

        this.updateBookStatus = this.updateBookStatus.bind(this) as
            (req: Request, res: Response) => Promise<void>;

        this.deleteBook = this.deleteBook.bind(this) as
            (req: Request, res: Response) => Promise<void>;
    }

    async createBook(req: Request, res: Response) {
        try {
            const dto: CreateBookDto = req.body;
            const book = await this.bookService.createBook(dto);
            res.status(201).json({ message: 'Book Created Successfully', book });
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to create book' });
        }
    }

    async listBooks(req: Request, res: Response) {
        try {
            const search = req.query.search as string | undefined;
            const books = await this.bookService.listBooks(search);
            res.json(books);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to list books' });
        }
    }

    async getBookById(req: Request, res: Response, next: NextFunction) {
        try {
            const book = await this.bookService.getBookById(parseInt(req.params.id));

            if (!book) {
                res.status(404).json({ error: 'Book not found' });
            }

            res.json({ book });
        } catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : 'Failed to get book'
            });
        }
    }

    async updateBook(req: Request, res: Response) {
        try {
            const updatedBook = await this.bookService.updateBook(
                parseInt(req.params.id),
                req.body
            );
            res.json({ message: 'Book updated', book: updatedBook });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Update Failed :('
            const status = message === 'Book not found' ? 404 : 400
            res.status(status).json({ error: message });
        }
    }

    async updateBookStatus(req: Request, res: Response) {
        try {
            const book = await this.bookService.getBookById(parseInt(req.params.id));
            await this.bookService.updateBookStatus(parseInt(req.params.id), req.body);
            res.json({ message: 'Book updated successfully', book });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Update Failed :('
            const status = message === 'Book not found' ? 404 : 400
            res.status(status).json({ error: message });
        }
    }

    async deleteBook(req: Request, res: Response) {
        try {
            await this.bookService.deleteBook(parseInt(req.params.id));
            res.json({ message: 'Book deleted successfully' });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Deletion failed';
            const status = message === 'Book not found' ? 404 : 400;
            res.status(status).json({ error: message });
        }
    }
}