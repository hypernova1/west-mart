import * as jwt from 'jsonwebtoken';
import {NextFunction, Request, Response} from 'express';
import UserRepository from '../repository/user_repository';
import {UserSummary} from '../payload/user';

const userRepository = new UserRepository();

export const checkJwt = async (req: Request, res: Response, next: NextFunction) => {
    const token = <string>req.headers['authorization'];

    let jwtPayload;

    try {
        jwtPayload = <any>jwt.verify(token, 'secret');
        res.locals.jwtPayload = jwtPayload;
    } catch (err) {
        res.status(401).send();
        return;
    }

    const { id, email, nickname } = jwtPayload;
    const newToken = jwt.sign({ id, nickname }, 'secret', {
        expiresIn: '1h'
    });

    const user = await userRepository.findByEmail(email);
    req.user = {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
    } as UserSummary;

    res.setHeader('token', newToken);

    next();
}