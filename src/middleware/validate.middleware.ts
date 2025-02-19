import { NextFunction, Request, Response } from "express"
import { plainToInstance } from 'class-transformer';
import { validate } from "class-validator";
import { BadRequestError } from "../errors/http.errors";

export const validateRequest = <T extends Object>(dtoClass: new () => T) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dto = plainToInstance(dtoClass, req.body);
        const errors = await validate(dto);

        if (errors.length > 0) {
            const errorMessages = errors.map(error => Object.values(error.constraints || {}));

            return next(new BadRequestError('Validation failed', {
                errors: errorMessages,
                fields: errors.map(error => ({
                    property: error.property,
                    constraints: error.constraints
                }))
            }));
        }

        req.body = dto;
        next();
    }
}
