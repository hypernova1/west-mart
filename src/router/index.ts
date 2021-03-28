import { Request, Response, NextFunction, Application, Router } from 'express';
import userRouter from './user_router';
import authRouter from './auth_router';
import postRouter from './post_router';

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
