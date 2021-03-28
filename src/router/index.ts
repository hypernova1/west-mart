import { Request, Response, NextFunction, Application, Router } from 'express';
import userRouter from './user';
import authRouter from './auth';
import postRouter from './post';

const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('hello');
});

const setRouter = (express: Application) => {
    express.use('/', router);
    express.use('/user', userRouter);
    express.use('/auth', authRouter);
    express.use('/post', postRouter);
}

export default setRouter;
