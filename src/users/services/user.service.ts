import { CreateUserInput, UpdateCurrentUserInput, UpdateUserInput } from "../schemas/create-user.schema";
import { ConflictError, NotFoundError } from "../../errors/http.errors";
import { UserRepository } from "../repositories/user.repository";
import { Loan, User } from "@prisma/client";
import * as bcrypt from 'bcrypt';

export class UserService {
    constructor(private userRepository = new UserRepository()) { }

    private excludePassword(user: User): Omit<User, 'password'> {
        const { password, ...safeUser } = user;
        return safeUser;
    }

    async createUser(data: CreateUserInput) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new ConflictError('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.userRepository.create({
            ...data,
            password: hashedPassword
        });

        return this.excludePassword(user);
    }

    async getUserById(userId: number): Promise<Omit<User, 'password'>> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError('User')
        }

        return this.excludePassword(user)
    }

    async getUserByEmailWithPassword(email: string): Promise<User | null> {
        return this.userRepository.findUserByEmail(email);
    }

    async updateUser(id: number, data: UpdateUserInput) {
        if (data.email) {
            const existingUser = await this.userRepository.findByEmail(data.email);
            if (existingUser && existingUser.id !== id) {
                throw new ConflictError('Email already registered');
            }
        }

        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        const user = await this.userRepository.updateUser(id, data);
        return this.excludePassword(user);
    }


    async updateCurrentUser(id: number, data: UpdateCurrentUserInput) {
        return this.updateUser(id, data);
    }

    async deleteUser(id: number): Promise<void> {
        await this.userRepository.deleteUser(id);
    }

    async hasUnpaidFines(userId: number): Promise<boolean> {
        return this.userRepository.hasUnpaidFines(userId);
    }

    async getUserWithLoans(userId: number): Promise<Omit<User, 'password'> & { loans: Loan[] }> {
        const user = await this.userRepository.findUserWithLoans(userId);
        if (!user) {
            throw new NotFoundError('User');
        }

        return {
            ...this.excludePassword(user),
            loans: user.loans
        };
    }
}