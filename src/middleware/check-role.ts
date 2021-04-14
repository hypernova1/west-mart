import { Request, Response, NextFunction } from 'express';
import UserRepository from '../repository/user_repository';
import User from '../models/user';

const userRepository = new UserRepository();

export const checkRole = (roles: Array<string>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = res.locals.jwtPayload.id;

        const user: User = await userRepository.findById(id);

        if (!user) {
            res.status(401).send();
        }

        if (roles.indexOf(user.role) > -1) {
            next();
        }
        else res.status(401).send();
    }
}