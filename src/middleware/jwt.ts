import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    const token = <string>req.headers['authorization'];

    let jwtPayload;

    try {
        jwtPayload = <any>jwt.verify(token, 'secret');
        res.locals.jwtPayload = jwtPayload;
    } catch (err) {
        res.status(401).send();
        return;
    }

    const { userId, nickname } = jwtPayload;
    const newToken = jwt.sign({ userId, nickname }, 'secret', {
        expiresIn: '1h'
    });

    res.setHeader('token', newToken);

    next();
}