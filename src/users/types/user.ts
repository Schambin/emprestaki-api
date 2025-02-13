import { Role } from "@prisma/client";

export type SafeUser = {
    id: number,
    name: string,
    email: string,
    role: Role,
};