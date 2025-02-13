import { UserService } from "./user.service";
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { UnauthorizedError } from "../../errors/http.errors";
import { UserRepository } from "../repositories/user.repository";

export class AuthService {
    constructor(
        private userRepository = new UserRepository(),
        private jwtSecret = process.env.JWT_SECRET!
    ) { }

    async validateUser(email: string, password: string): Promise<{ id: number; email: string; role: string }> {
        const user = await this.userRepository.findUserByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedError('Invalid credentials');
        }

        return {
            id: user.id,
            email: user.email,
            role: user.role
        };
    }

    generateToken(user: { id: number; email: string; role: string }): string {
        return jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role
            }, this.jwtSecret, { expiresIn: '1h' }
        );
    }
}