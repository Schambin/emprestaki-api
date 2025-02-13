import { BookStatus } from "@prisma/client";

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