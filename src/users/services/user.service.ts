import { UpdateCurrentUserDto, UpdateUserDto } from "../dtos/update-user.dto";
import { BadRequestError, NotFoundError } from "../../errors/http.errors";
import { UserRepository } from "../repositories/user.repository";
import { CreateUserDto } from "../dtos/create-user.dto";
import { Loan, User } from "@prisma/client";
import * as bcrypt from 'bcrypt';

export class UserService {
    constructor(private userRepository = new UserRepository()) { }

    private excludePassword(user: User): Omit<User, 'password'> {
        const { password, ...safeUser } = user;
        return safeUser;
    }

    async createUser(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
        const existingUser = await this.userRepository.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new BadRequestError('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.userRepository.create({
            ...createUserDto,
            password: hashedPassword
        });

        return this.excludePassword(user)
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

    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
        if (updateUserDto.email) {
            const existingUser = await this.userRepository.findByEmail(updateUserDto.email);
            if (existingUser && existingUser.id !== id) {
                throw new BadRequestError('Email already registered');
            }
        }

        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        const user = await this.userRepository.updateUser(id, updateUserDto);
        return this.excludePassword(user);
    }

    async updateCurrentUser(id: number, updateDto: UpdateCurrentUserDto): Promise<Omit<User, 'password'>> {
        if (updateDto.email) {
            const existingUser = await this.userRepository.findByEmail(updateDto.email);
            if (existingUser && existingUser.id !== id) {
                throw new BadRequestError('Email already registered');
            }
        }

        return this.updateUser(id, updateDto);
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