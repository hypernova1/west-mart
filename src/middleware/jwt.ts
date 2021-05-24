import * as jwt from 'jsonwebtoken';
import sequelize from '@model/index';
import {NextFunction, Request, Response} from 'express';
import User from '@model/user';

const userRepository = sequelize.getRepository(User);

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

    req.user = await userRepository.findOne({
        where: {
            email: email
        }
    });

    res.setHeader('token', newToken);

    next();
}