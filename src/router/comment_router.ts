import { Router } from 'express';
import { checkJwt } from '@middleware/jwt';
import { checkRole } from '@middleware/check-role';
import validate from '@validate/index';
import commentValidator from '@validate/comment';
import User from '@model/user';
import CommentService from '@service/comment_service';
import { Container } from 'typedi';
import Role from '@constant/role';
import HttpStatus from '@constant/http_status';

const router = Router();
const commentService = Container.get(CommentService);

router.delete(
  '/:id',
  checkJwt,
  checkRole([Role.ADMIN, Role.USER]),
  async (req, res, next) => {
    try {
      const user = req.user as User;
      const commentId = +req.params.id;

      await commentService.deleteComment(commentId, user.id);

      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  '/:id',
  checkJwt,
  checkRole([Role.ADMIN, Role.USER]),
  validate(commentValidator['update']),
  async (req, res, next) => {
    try {
      const userId: number = req.user.id;
      const id: number = +req.params.id;
      const content: string = req.body.content;

      await commentService.updateComment(id, content, userId);

      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (err) {
      next(err);
    }
  }
);

export default router;
