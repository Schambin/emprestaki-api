import { BadRequestError, NotFoundError } from "../../errors/http.errors";
import { NextFunction, Request, Response } from "express";
import { BookService } from "../services/books.service";

export class BookController {
    constructor(private bookService = new BookService()) {
        this.bindMethods();
    }

    private bindMethods() {
        const methods: Array<keyof BookController> = [
            'createBook', 'listBooks', 'getBookById',
            'updateBook', 'updateBookStatus', 'deleteBook',
            'searchBooks'
        ];

        methods.forEach(m => {
            this[m] = (this[m] as any).bind(this);
        });
    }

    async createBook(req: Request, res: Response): Promise<void> {
        try {
            const { title, author, category, status } = req.body;
            const book = await this.bookService.createBook({
                title,
                author,
                category,
                status
            });
            res.status(201).json({ message: 'Book Created Successfully', book });
        } catch (error) {
            if (error instanceof BadRequestError) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'Failed to create book' });
        }
    }

    async listBooks(req: Request, res: Response): Promise<void> {
        try {
            const search = req.query.search as string | undefined;
            const books = await this.bookService.listBooks(search);
            res.json(books);
        } catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : 'Failed to list books'
            });
        }
    }

    async getBookById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const bookId = parseInt(req.params.id);

            if (isNaN(bookId)) {
                throw new BadRequestError('Invalid book ID format');
            }

            const book = await this.bookService.getBookById(bookId);

            if (!book) {
                throw new NotFoundError('Book');
            }

            res.json({ book });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ error: error.message });
                return;
            }
            res.status(500).json({
                error: error instanceof Error ? error.message : 'Failed to get book'
            });
        }
    }

    async updateBook(req: Request, res: Response): Promise<void> {
        try {
            const updatedBook = await this.bookService.updateBook(
                parseInt(req.params.id),
                req.body
            );
            res.json({ message: 'Book updated', book: updatedBook });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ error: error.message });
                return;
            }
            res.status(400).json({
                error: error instanceof Error ? error.message : 'Update failed'
            });
        }
    }

    async updateBookStatus(req: Request, res: Response) {
        try {
            const updatedBook = await this.bookService.updateBookStatus(
                parseInt(req.params.id),
                req.body.status
            );
            res.json({ message: 'Book status updated', book: updatedBook });
        } catch (error) {
            if (error instanceof NotFoundError) {
                return res.status(404).json({ error: error.message });
            }
            res.status(400).json({
                error: error instanceof Error ? error.message : 'Status update failed'
            });
        }
    }

    async deleteBook(req: Request, res: Response): Promise<void> {
        try {
            await this.bookService.deleteBook(parseInt(req.params.id));
            res.json({ message: 'Book deleted successfully' });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ error: error.message });
                return;
            }
            res.status(500).json({
                error: error instanceof Error ? error.message : 'Deletion failed'
            });
        }
    }

    async searchBooks(req: Request, res: Response) {
        try {
            const searchTerm = req.query.q as string;
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 10;

            const result = await this.bookService.searchBooks(searchTerm, page, pageSize);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'Search failed' });
        }
    }
}