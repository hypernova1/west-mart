import {Request, Response, NextFunction, Application} from "express";
import * as express from 'express';
import userRouter from './user';
import authRouter from './auth';
import auth from "./auth";

const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('hello');
});

const setRouter = (express: Application) => {
    express.use('/', router);
    express.use('/user', userRouter);
    express.use('/auth', authRouter);
}

export default setRouter;
