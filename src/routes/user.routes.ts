import { updateCurrentUserSchema } from "../users/schemas/create-user.schema";
import { updateUserSchema } from "../users/schemas/update-user.schema";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { UserController } from "../users/controllers/user.controller";
import { validateRequest } from "../middleware/validate.middleware";
import { AuthService } from "../users/services/auth.service";
import { createUserSchema } from "../schemas/user.schema";
import { Router } from "express"
import { z } from "zod";

export const userRoutes = () => {
    const router = Router();
    const userController = new UserController();
    const authService = new AuthService();

    router.post('/',
        authenticate,
        authorize(['ADMINISTRADOR']),
        validateRequest(createUserSchema),
        userController.createUser
    );

    router.put('/:id',
        authenticate,
        authorize(['ADMINISTRADOR']),
        validateRequest(updateUserSchema),
        userController.updateUser
    );

    router.patch('/me',
        authenticate,
        validateRequest(updateCurrentUserSchema),
        userController.updateCurrentUser
    );

    router.get('/me',
        authenticate,
        userController.getCurrentUser
    );

    router.post('/auth/login',
        validateRequest(z.object({
            email: z.string().email(),
            password: z.string().min(6)
        })),
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