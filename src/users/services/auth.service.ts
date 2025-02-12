import { UserService } from "./user.service";
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

export class AuthService {
    private userService = new UserService();

    async validateUser(email: string, password: string) {
        const user = await this.userService.findUserByEmail(email);

        if(!user){ 
            return null
        }
        
        const validPassword = await bcrypt.compare(password, user.password);
        return validPassword ? user: null
    }

    generateToken(user: { id: number, email: string, role: string }){
        return jwt.sign({
            userId: user.id,
            email: user.email,
            role: user.role
        }, 
        process.env.JWT_SECRET!, { 
            expiresIn: '1h'
        });
    }
}