import { NextFunction, Router } from "express"
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validate.middleware";
import { CreateUserDto } from "../users/dtos/create-user.dto";
import { UserService } from "../users/services/user.service";
import { UserController } from "../users/controllers/user.controller";
import { AuthService } from "../users/services/auth.service";
import { LoginDto } from "../users/dtos/login.dto";

export const userRoutes = () => {
    const router = Router();
    const userController = new UserController();
    const userService = new UserService();
    const authService = new AuthService();

    // ADMIN-ONLY: Create user
    // TODO: Create a better error message when dont fit the DTO and when its not an admin
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