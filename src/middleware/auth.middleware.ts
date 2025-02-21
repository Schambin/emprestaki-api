import { ForbiddenError, UnauthorizedError } from "../errors/http.errors";
import { NextFunction, Request, Response } from "express";
import { SafeUser } from "../users/types/user";
import prisma from "../prisma/client";
import jwt from "jsonwebtoken";

declare module 'express' {
    interface Request {
        user?: SafeUser;
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new UnauthorizedError('Authentication required');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            }
        });

        if (!user) {
            throw new UnauthorizedError('User Not Found');
        }

        req.user = user as SafeUser;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please Authenticate' });
    }
};

export const authorize = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user || !allowedRoles.includes(req.user.role)) {
                throw new ForbiddenError();
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};