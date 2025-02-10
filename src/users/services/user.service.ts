import prisma from "../../prisma/client";
import * as bcrypt from 'bcrypt';

export class UserService {
    async createUser(name: string, email: string, password: string, role?: 'LEITOR' | 'ADMINISTRADOR') {

        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (existingUser) {
            throw new Error('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        return prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'LEITOR'
            }
        });
    }

    async findUserByEmail(email: string) {
        return prisma.user.findUnique({
            where: {
                email
            }
        })
    }

    async getUserWithLoans(userId: number) {
        return prisma.user.findUnique({
            where: { id: userId }, include: { loans: { where: { returnDate: null}, include: { book: true }}}
        });
    }
}