import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';

export class UserController {
    constructor(private userService = new UserService()) { };

    async createUser(req: Request) {
        return this.userService.createUser(req.body as CreateUserDto);
    }

    async getUserById(req: Request, res: Response) {
        const user = await this.userService.getUserById(parseInt(req.params.id));
        res.json({ user });
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