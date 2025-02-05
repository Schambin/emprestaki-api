import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                password: true,
                role: true,
                name: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid Token' });
    }
};

export const authorize = (roles: ('LEITOR' | 'ADMINISTRADOR')[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Unauthorized access' });
        }
        next();
    };
};