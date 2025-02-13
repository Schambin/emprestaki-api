import { NextFunction, Router } from "express"
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validate.middleware";
import { CreateUserDto } from "../users/dtos/create-user.dto";
import { UserService } from "../users/services/user.service";
import { UserController } from "../users/controllers/user.controller";
import { AuthService } from "../users/services/auth.service";

export const userRoutes = () => {
    const router = Router();
    const userController = new UserController();
    const userService = new UserService();
    const authService = new AuthService();

    // ADMIN-ONLY: Create user
    router.post('/users',
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

    router.get('/users/me',
        authenticate,
        async (req, res) => {
            try {
                const user = await userService.getUserWithLoans(req.body.user.id);
                res.json({ user });
            } catch (error) {
                res.status(500).json({ error: 'Failed to fetch user profile' });
            }
        }
    );

    router.post('/auth/login',
        validateRequest(CreateUserDto),
        async (req, res): Promise<any> => {
            try {
                const user = await authService.validateUser(req.body.email, req.body.password);
                if (!user) {
                    return res.status(401).json({ error: 'Invalid Credentials' });
                }
                const token = authService.generateToken(user);
                res.json({ access_token: token });

            } catch (error) {

                res.status(500).json({ error: 'Login Failed' });

            }
        }
    );

    return router;
}