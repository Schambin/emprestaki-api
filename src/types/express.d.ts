import { SafeUser } from "./user";

declare global {
    namespace Express {
        interface Request {
            user?: SafeUser;
        }
    }
}