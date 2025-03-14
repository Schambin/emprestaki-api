import { UnauthorizedError } from "../../errors/http.errors";
import { UserService } from "./user.service";
import { Role } from "@prisma/client";
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthToken:
 *       type: object
 *       properties:
 *         access_token:
 *           type: string
 *           description: JWT token para autenticação
 *       example:
 *         access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */
export class AuthService {
    constructor(
        private userService = new UserService(),
        private jwtSecret = process.env.JWT_SECRET!
    ) {
        if (!jwtSecret) {
            throw new Error('JWT_SECRET environment variable is not set');
        }
    }

    /**
     * @swagger
     * @description Valida as credenciais do usuário e retorna dados básicos do usuário
     * @param {string} email - Email do usuário
     * @param {string} password - Senha do usuário
     * @returns {Promise<{id: number, email: string, role: Role}>} Dados do usuário autenticado
     * @throws {UnauthorizedError} Caso as credenciais sejam inválidas
     * 
     * @example
     * await authService.validateUser('user@example.com', 'senha123@')
     */
    async validateUser(email: string, password: string): Promise<{ id: number; email: string; role: Role; }> {
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

    /**
     * @swagger
     * @description Gera um token JWT para o usuário autenticado
     * @param {Object} user - Dados do usuário
     * @param {number} user.id - ID do usuário
     * @param {string} user.email - Email do usuário
     * @param {Role} user.role - Perfil do usuário
     * @returns {string} Token JWT assinado
     * 
     * @example
     * generateToken({ id: 1, email: 'user@example.com', role: 'LEITOR' })
     */
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