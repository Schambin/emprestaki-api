import { Router } from 'express';
import { createBookSchema } from '../books/schemas/create-book.schema';
import { updateBookSchema } from '../books/schemas/update-book.schema';
import { validateRequest } from '../middleware/validate.middleware';
import { BookController } from '../books/controllers/books.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

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


    router.get('/',
        controller.listBooks
    );

    router.get('/:id',
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
