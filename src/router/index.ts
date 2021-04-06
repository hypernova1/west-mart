import { Request, Response, NextFunction, Application, Router } from 'express';
import userRouter from './user_router';
import authRouter from './auth_router';
import postRouter from './post_router';
import commentRouter from './comment_router';

const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('hello');
});

const setRouter = (express: Application) => {
    express.use('/auth', authRouter);
    express.use('/comment', commentRouter);
    express.use('/post', postRouter);
    express.use('/user', userRouter);
    express.use('/', router);
}

export default setRouter;
