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

    async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await this.userService.createUser(req.body as CreateUserInput);
            res.status(201).json(user);
        } catch (error) {
            if (error instanceof BadRequestError) {
                res.status(400).json({ error: error.message });
                return;
            }
            // res.status(500).json({ error: 'Registration failed' });
            next(error)
        }
    }

    async getUserById(req: Request, res: Response) {
        const user = await this.userService.getUserById(parseInt(req.params.id));
        res.json({ user });
    }

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

    async deleteUser(req: Request, res: Response) {
        await this.userService.deleteUser(parseInt(req.params.id));
        res.status(204).send();
    }
}