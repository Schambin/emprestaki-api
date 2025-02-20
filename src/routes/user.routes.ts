import { UpdateCurrentUserDto, UpdateUserDto } from "../users/dtos/update-user.dto";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { UserController } from "../users/controllers/user.controller";
import { validateRequest } from "../middleware/validate.middleware";
import { CreateUserDto } from "../users/dtos/create-user.dto";
import { AuthService } from "../users/services/auth.service";
import { LoginDto } from "../users/dtos/login.dto";
import { Router } from "express"

export const userRoutes = () => {
    const router = Router();
    const userController = new UserController();
    const authService = new AuthService();

    router.post('/',
        authenticate,
        authorize(['ADMINISTRADOR']),
        validateRequest(CreateUserDto),
        async (req, res) => {
            try {
                const user = await userController.createUser(req);
                res.status(201).json(user);
            } catch (error) {
                res.status(400).json({
                    error: error instanceof Error ? error.message : 'Registration failed'
                });
            }
        }
    );

    router.put('/:id',
        authenticate,
        authorize(['ADMINISTRADOR']),
        validateRequest(UpdateUserDto),
        async (req, res) => {
            try {
                const user = await userController.updateUser(req, res);
                res.json(user);
            } catch (error) {
                res.status(400).json({
                    error: error instanceof Error ? error.message : 'Update failed'
                });
            }
        }
    );

    router.patch('/me',
        authenticate,
        validateRequest(UpdateCurrentUserDto),
        async (req, res) => {
            try {
                const user = await userController.updateCurrentUser(req, res);
                res.json(user);
            } catch (error) {
                res.status(400).json({
                    error: error instanceof Error ? error.message : 'Update failed'
                });
            }
        }
    );

    router.get('/me',
        authenticate,
        (req, res) => userController.getCurrentUser(req, res)
    );

    router.post('/auth/login',
        validateRequest(LoginDto),
        async (req, res, next) => {
            try {
                const user = await authService.validateUser(req.body.email, req.body.password);
                const token = authService.generateToken(user);
                res.json({ access_token: token });
            } catch (error) {
                next(error);
            }
        }
    );

    return router;
}