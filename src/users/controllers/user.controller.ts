import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { SafeUser } from '../../users/types/user';

export class UserController {
    constructor(private userService = new UserService()) { };
    async createUser(req: Request) {
        const user = req.user;
        req.user = user as SafeUser;
        return this.userService.createUser(req.body as CreateUserDto);
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

    async updateUser(req: Request, res: Response) {
        const user = await this.userService.updateUser(
            parseInt(req.params.id),
            req.body
        );
        res.json({ user });
    }

    async deleteUser(req: Request, res: Response) {
        await this.userService.deleteUser(parseInt(req.params.id));
        res.status(204).send();
    }
}