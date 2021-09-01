import { Request, Response, Router } from 'express';
import { checkJwt } from '@middleware/jwt';
import { checkRole } from '@middleware/check-role';
import validate from '@validate/index';
import commentValidator from '@validate/comment';
import User from '@model/user';
import CommentService from '@service/comment_service';
import { Container } from 'typedi';
import Role from '@constant/role';
import HttpStatus from '@constant/http_status';
import wrapAsync from '@util/async_wrapper';

const router = Router();
const commentService = Container.get(CommentService);

router.delete(
  '/:id',
  checkJwt,
  checkRole([Role.ADMIN, Role.USER]),
  wrapAsync(async (req: Request, res: Response) => {
    const user = req.user as User;
    const commentId = +req.params.id;

    await commentService.deleteComment(commentId, user.id);

    return res.status(HttpStatus.NO_CONTENT).send();
  })
);

router.put(
  '/:id',
  checkJwt,
  checkRole([Role.ADMIN, Role.USER]),
  validate(commentValidator['update']),
  wrapAsync(async (req: Request, res: Response) => {
    const userId: number = req.user.id;
    const id: number = +req.params.id;
    const content: string = req.body.content;

    await commentService.updateComment(id, content, userId);

    return res.status(HttpStatus.NO_CONTENT).send();
  })
);

export default router;
