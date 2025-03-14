import { validateBookId, validateRequest } from '../middleware/validate.middleware';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { createBookSchema } from '../books/schemas/create-book.schema';
import { BookController } from '../books/controllers/books.controller';
import { updateBookSchema } from '../books/schemas/update-book.schema';
import { Router } from 'express';

export const bookRoutes = () => {
    const router = Router();
    const controller = new BookController();
    
    router.post(
        '/',
        authenticate,
        authorize(['ADMINISTRADOR']),
        validateRequest(createBookSchema),
        controller.createBook
    );

    router.get('/search',
        authenticate,
        authorize(['LEITOR', 'ADMINISTRADOR']),
        controller.searchBooks
    );

    router.get('/',
        controller.listBooks
    );

    router.get('/:id',
        validateBookId,
        controller.getBookById
    );

    router.put('/:id',
        authenticate,
        authorize(['ADMINISTRADOR']),
        validateRequest(updateBookSchema),
        controller.updateBook
    );

    router.delete('/:id',
        authenticate,
        authorize(['ADMINISTRADOR']),
        controller.deleteBook
    );


    return router;
}
