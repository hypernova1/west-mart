import { Request, Response, NextFunction } from 'express';
import UserRepository from '../repository/user_repository';
import User from '../models/user';

const userRepository = new UserRepository();

export const checkRole = (roles: Array<string>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = res.locals.jwtPayload.id;
        const role = res.locals.jwtPayload.role;

        if (roles.indexOf(role) > -1) {
            next();
        }
        else res.status(401).send();
    }
}