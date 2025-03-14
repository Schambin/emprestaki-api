import { CreateUserInput, UpdateCurrentUserInput, UpdateUserInput } from '../schemas/create-user.schema';
import { BadRequestError, NotFoundError } from '../../errors/http.errors';
import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { SafeUser } from '../../users/types/user';

export class UserController {
    constructor(private userService = new UserService()) {
        this.bindMethods();
    }

    private bindMethods() {
        const methods: Array<keyof UserController> = [
            'createUser', 'getUserById', 'getCurrentUser',
            'updateUser', 'updateCurrentUser', 'deleteUser'
        ];

        methods.forEach(m => {
            this[m] = (this[m] as any).bind(this);
        });
    }

    /**
    * @swagger
    * /users:
    *   post:
    *     summary: Cria um novo usuário
    *     tags: [Users]
    *     security:
    *       - bearerAuth: []
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             $ref: '#/components/schemas/CreateUserInput'
    *     responses:
    *       201:
    *         description: Usuário criado com sucesso
    *         content:
    *           application/json:
    *             schema:
    *               $ref: '#/components/schemas/User'
    *       400:
    *         description: |
    *           Erros de validação:
    *           - Nome deve ter 2-50 caracteres
    *           - Email inválido
    *           - Senha deve conter: 1 maiúscula, 1 minúscula, 1 número, 1 caractere especial
    *       401:
    *         description: Não autenticado
    *       403:
    *         description: Acesso negado (apenas ADMINISTRADOR)
    *       500:
    *         description: Erro interno no servidor
    */
    async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await this.userService.createUser(req.body as CreateUserInput);
            res.status(201).json(user);
        } catch (error) {
            if (error instanceof BadRequestError) {
                res.status(400).json({ error: error.message });
                return;
            }
            next(error)
        }
    }

    /**
     * @swagger
     * /users/{id}:
     *   get:
     *     summary: Busca usuário por ID
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *     responses:
     *       200:
     *         description: Usuário encontrado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       400:
     *         description: ID inválido
     *       401:
     *         description: Não autenticado
     *       404:
     *         description: Usuário não encontrado
     *       500:
     *         description: Erro interno no servidor
     */
    async getUserById(req: Request, res: Response) {
        const user = await this.userService.getUserById(parseInt(req.params.id));
        res.json({ user });
    }

    /**
     * @swagger
     * /users/me:
     *   get:
     *     summary: Obtém informações do usuário logado
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Dados do usuário atual
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       401:
     *         description: Não autenticado
     *       500:
     *         description: Erro interno no servidor
     */
    async getCurrentUser(req: Request, res: Response) {
        try {
            const user = req.user;
            req.user = user as SafeUser;
            const userWithLoans = await this.userService.getUserWithLoans(req.user.id);
            res.json(userWithLoans);
        } catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : 'Failed to fetch profile'
            });
        }
    }

    /**
     * @swagger
     * /users/{id}:
     *   put:
     *     summary: Atualiza um usuário (admin)
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateUserInput'
     *     responses:
     *       200:
     *         description: Usuário atualizado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       400:
     *         description: Dados inválidos
     *       401:
     *         description: Não autenticado
     *       403:
     *         description: Acesso negado (apenas ADMINISTRADOR)
     *       404:
     *         description: Usuário não encontrado
     *       500:
     *         description: Erro interno no servidor
     */
    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const updatedUser = await this.userService.updateUser(
                parseInt(req.params.id),
                req.body as UpdateUserInput
            );
            res.json(updatedUser);
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ error: error.message });
                return;
            }
            res.status(400).json({ error: 'Update failed' });
        }
    }

    /** 
     * @swagger
     * /users/me:
     *   patch:
     *     summary: Atualiza dados do usuário logado
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateCurrentUserInput'
     *     responses:
     *       200:
     *         description: Dados atualizados
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       400:
     *         description: Dados inválidos
     *       401:
     *         description: Não autenticado
     *       500:
     *         description: Erro interno no servidor
     */
    async updateCurrentUser(req: Request, res: Response) {
        try {
            const user = req.user!;
            const updatedUser = await this.userService.updateCurrentUser(
                user.id,
                req.body as UpdateCurrentUserInput
            );
            res.json(updatedUser);
        } catch (error) {
            res.status(400).json({
                error: error instanceof Error ? error.message : 'Update failed'
            });
        }
    }

    /**
     * @swagger
     * /users/{id}:
     *   delete:
     *     summary: Exclui um usuário
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *     responses:
     *       204:
     *         description: Usuário excluído com sucesso
     *       401:
     *         description: Não autenticado
     *       403:
     *         description: Acesso negado (apenas ADMINISTRADOR)
     *       404:
     *         description: Usuário não encontrado
     *       500:
     *         description: Erro interno no servidor
     */
    async deleteUser(req: Request, res: Response) {
        await this.userService.deleteUser(parseInt(req.params.id));
        res.status(204).send();
    }
}