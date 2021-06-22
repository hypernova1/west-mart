import { Request, Response, NextFunction, Application, Router } from 'express';
import adminRouter from '@router/admin_router';
import userRouter from '@router/user_router';
import authRouter from '@router/auth_router';
import postRouter from '@router/post_router';
import commentRouter from '@router/comment_router';
import categoryRouter from '@router/category_router';

const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('hello west mart!');
});

const setRouter = (express: Application) => {
    express.use('/admin', adminRouter);
    express.use('/auth', authRouter);
    express.use('/category', categoryRouter);
    express.use('/comment', commentRouter);
    express.use('/post', postRouter);
    express.use('/user', userRouter);
    express.use('/', router);
}

export default setRouter;
