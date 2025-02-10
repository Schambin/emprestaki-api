import { Router } from "express"
import { UserController } from "../users/controllers/user.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { CreateUserDto } from "../users/dtos/create-user.dto";
import { UserService } from "../users/services/user.service";
import { AuthService } from "../users/services/auth.service";

export const userRoutes = () => {
    const router = Router();
    const userController = new UserController();
    const userService = new UserService();
    const authService = new AuthService();

    // ADMIN-ONLY: Create user
    router.post('/',
        authenticate,
        authorize(['ADMINISTRADOR']),
        validateRequest(CreateUserDto),
        async (req, res) => {
            try {
                const { name, email, password, role } = req.body;
                const user = await userService.createUser(name, email, password, role);
                res.status(201).json({ user });
            } catch (error) {
                res.status(400).json({ error: error.message });
              }
        }
    );

    router.get('/users/me', 
        authenticate, 
        async(req, res) => { 
            try {
                const user = await userService.getUserWithLoans(req.user.id);
                res.json({ user });
            } catch (error) {
                res.status(500).json({ error: 'Failed to fetch user profile' });
            }
        }
    );

    router.post('/auth/login', 
        validateRequest(CreateUserDto), 
        async(req, res) => {    //TODO
            try {

                const user = await authService.validateUser(req.body.email, req.body.password);
                if(!user) {
                    return res.status(401).json({ error: 'INvalid Credentials' });
                }
                const token = await authService.generateToken(user);
                res.json({ access_token: token });

            } catch (error) {

                res.status(500).json({ error: 'Login Failed' });

            }
        }
    );

    return router;
}