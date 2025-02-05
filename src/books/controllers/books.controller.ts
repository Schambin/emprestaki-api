import { NextFunction, Request, Response } from "express";
import { BookService } from "../services/books.service";

// TODO: create a better error validation

export class BookController {
    private bookService: BookService;
    constructor() {
        this.bookService = new BookService();
    }

    async createBook(req: Request, res: Response) {
        try {
            const book = await this.bookService.createBook(req.body);
            res.status(201).json({ message: 'Book Created Successfully', book });
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to create book' });
        }
    }

    async listBooks(req: Request, res: Response) {
        try {
            const search = req.query.search as string | undefined;
            await this.bookService.listBooks(search);
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
}