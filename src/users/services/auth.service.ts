import { UserService } from "./user.service";
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { UnauthorizedError } from "../../errors/http.errors";
import { UserRepository } from "../repositories/user.repository";
import { Role } from "@prisma/client";

export class AuthService {
    constructor(
        private userService = new UserService(),
        private jwtSecret = process.env.JWT_SECRET!
    ) {
        if (!jwtSecret) {
            throw new Error('JWT_SECRET environment variable is not set');
        }
    }

    async validateUser(email: string, password: string) {
        try {
            const user = await this.userService.getUserByEmailWithPassword(email);

            if (!user || !(await bcrypt.compare(password, user.password))) {
                throw new UnauthorizedError('Invalid email or password');
            }

            return {
                id: user.id,
                email: user.email,
                role: user.role
            };
        } catch (error) {
            throw new UnauthorizedError('Authentication failed');
        }
    }

    // Letting this here cause sometime i will need to use again
    //
    // async validateUser(email: string, password: string) {
    //     try {
    //         console.log('Searching for user:', email);
    //         const user = await this.userService.getUserByEmailWithPassword(email);
    //         console.log('Found user:', user);

    //         if (!user) {
    //             console.log('User not found');
    //             throw new UnauthorizedError('Invalid credentials');
    //         }

    //         console.log('Comparing passwords...');
    //         const validPassword = await bcrypt.compare(password, user.password);
    //         console.log('Password valid:', validPassword);

    //         if (!validPassword) {
    //             throw new UnauthorizedError('Invalid credentials');
    //         }

    //         return { id: user.id, email: user.email, role: user.role };
    //     } catch (error) {
    //         console.error('Authentication error:', error);
    //         throw new UnauthorizedError('Authentication failed');
    //     }
    // }

    generateToken(user: { id: number; email: string; role: Role }): string {
        return jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role
            },
            this.jwtSecret,
            { expiresIn: '1h' }
        );
    }
}