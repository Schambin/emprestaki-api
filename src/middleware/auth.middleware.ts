import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client";

export const authenticate = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer', '');
        if(!token) throw new Error();

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
        const user = await prisma.user.findUnique({ where: { id: decoded.userId }});
        if(!user) throw new Error();

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please Authenticate' });
    }
};

export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if(!roles.includes(req.user.role)) {
            return res.status(401).json({ error: 'Unauthorized access'})
        }
        next();
    };
};