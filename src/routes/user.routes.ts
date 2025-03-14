import { updateCurrentUserSchema } from "../users/schemas/create-user.schema";
import { updateUserSchema } from "../users/schemas/update-user.schema";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { UserController } from "../users/controllers/user.controller";
import { validateRequest } from "../middleware/validate.middleware";
import { AuthService } from "../users/services/auth.service";
import { createUserSchema } from "../schemas/user.schema";
import { Router } from "express"
import { z } from "zod";

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Operações de autenticação de usuários
 */
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

    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: Autentica usuário e retorna token JWT
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *               password:
     *                 type: string
     *                 format: password
     *             required:
     *               - email
     *               - password
     *     responses:
     *       200:
     *         description: Token JWT gerado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/AuthToken'
     *       401:
     *         description: Credenciais inválidas
     */
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