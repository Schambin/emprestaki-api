import { Prisma } from "@prisma/client";
import prisma from "../../prisma/client";

export class UserRepository {
    async create(data: Prisma.UserCreateInput) {
        return await prisma.book.create({ data });
    }

    
}