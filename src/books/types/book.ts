import { BookStatus } from "@prisma/client";

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         category:
 *           type: string
 *         status:
 *           type: string
 *           enum: [AVAILABLE, RENTED]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

export type CreateBookInput = {
    title: string;
    author: string;
    category: string;
};

export type UpdateBookInput = {
    title?: string;
    author?: string;
    category?: string;
    status?: BookStatus;
};