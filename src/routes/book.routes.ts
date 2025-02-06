import { Router } from "express";
import { BookController } from "../books/controllers/books.controller";

export const bookRoutes = () => {
    const router = Router();
    const controller = new BookController();

    router.post('/', controller.createBook.bind(controller))
    router.get('/', controller.listBooks.bind(controller))
    router.get('/:id', controller.getBookById.bind(controller))
    router.put('/:id', controller.updateBook.bind(controller))
    router.delete('/:id', controller.deleteBook.bind(controller))

    return router;
}
