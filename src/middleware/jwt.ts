import * as jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import UserRepository from '@repository/user_repository';

const userRepository = new UserRepository();

export const checkJwt = async (req: Request, res: Response, next: NextFunction) => {
    const token = <string>req.headers['authorization'].split(' ')[1];

    let jwtPayload;

    try {
        jwtPayload = <any>jwt.verify(token, 'secret');
        res.locals.jwtPayload = jwtPayload;
    } catch (err) {
        console.log(err);
        res.status(401).json(err);
        return;
    }

    const { id, email, nickname, role } = jwtPayload;
    const newToken = jwt.sign({ id, email, nickname, role }, 'secret', {
        expiresIn: '1h'
    });

    req.user = await userRepository.findByEmail(email);

    res.setHeader('token', newToken);

    next();
}