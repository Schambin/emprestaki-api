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

    /**
    * @swagger
    * /books:
    *   post:
    *     summary: Cria um novo livro
    *     tags: [Books]
    *     security:
    *       - bearerAuth: []
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             $ref: '#/components/schemas/CreateBookInput'
    *     responses:
    *       201:
    *         description: Livro criado com sucesso
    *         content:
    *           application/json:
    *             schema:
    *               $ref: '#/components/schemas/Book'
    *       400:
    *         description: |
    *           Erros de validação:
    *           - Título deve ter 2-100 caracteres
    *           - Autor deve ter 2-50 caracteres
    *           - Categoria deve ter 2-50 caracteres
    *       401:
    *         description: Não autenticado
    *       403:
    *         description: Acesso negado (apenas ADMINISTRADOR)
    *       500:
    *         description: Erro interno no servidor
    */
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

    /**
     * @swagger
     * /books/{id}:
     *   get:
     *     summary: Busca livro por ID
     *     tags: [Books]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *     responses:
     *       200:
     *         description: Livro encontrado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Book'
     *       400:
     *         description: ID inválido
     *       404:
     *         description: Livro não encontrado
     *       500:
     *         description: Erro interno no servidor
     */
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

    /**
     * @swagger
     * /books/{id}:
     *   put:
     *     summary: Atualiza um livro existente
     *     tags: [Books]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateBookInput'
     *     responses:
     *       200:
     *         description: Livro atualizado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Book'
     *       400:
     *         description: Dados inválidos
     *       401:
     *         description: Não autenticado
     *       403:
     *         description: Acesso negado (apenas ADMINISTRADOR)
     *       404:
     *         description: Livro não encontrado
     *       500:
     *         description: Erro interno no servidor
     */
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

    /**
     * @swagger
     * /books/{id}:
     *   delete:
     *     summary: Exclui um livro
     *     tags: [Books]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *     responses:
     *       200:
     *         description: Livro excluído com sucesso
     *       401:
     *         description: Não autenticado
     *       403:
     *         description: Acesso negado (apenas ADMINISTRADOR)
     *       404:
     *         description: Livro não encontrado
     *       500:
     *         description: Erro interno no servidor
     */
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