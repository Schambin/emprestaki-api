import { Router } from "express";
import { BookController } from "../books/controllers/books.controller";
import { validateRequest } from "../middleware/validate.middleware";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { CreateBookDto } from "../books/dtos/createBook.dto";
import { UpdateBookDto } from "../books/dtos/updateBook.dto";

export const bookRoutes = () => {
    const router = Router();
    const controller = new BookController();

    router.post('/',
        authenticate,
        authorize(['ADMINISTRADOR']),
        validateRequest(CreateBookDto),
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
        validateRequest(UpdateBookDto),
        controller.updateBook
    );

    router.delete('/:id',
        authenticate,
        authorize(['ADMINISTRADOR']),
        controller.deleteBook
    );

    return router;
}
