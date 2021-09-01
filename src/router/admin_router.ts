import { Request, Response, Router } from 'express';
import { checkJwt } from '@middleware/jwt';
import { checkRole } from '@middleware/check-role';
import AdminService from '@service/admin_service';
import PostService from '@service/post_service';
import CommentService from '@service/comment_service';
import Role from '@constant/role';
import { Container } from 'typedi';
import HttpStatus from '@constant/http_status';
import wrapAsync from '@util/async_wrapper';

const router = Router();
const adminService = Container.get(AdminService);
const postService = Container.get(PostService);
const commentService = Container.get(CommentService);

router.patch(
  '/user/:userId/approve',
  checkJwt,
  checkRole([Role.ADMIN]),
  wrapAsync(async (req: Request, res: Response) => {
    const userId = +req.params.userId;

    await adminService.approveUser(userId);

    return res.status(HttpStatus.NO_CONTENT).send();
  })
);

router.patch(
  '/user/:userId/ban',
  checkJwt,
  checkRole([Role.ADMIN]),
  wrapAsync(async (req: Request, res: Response) => {
    const userId = +req.params.userId;

    await adminService.banUser(userId);

    return res.status(HttpStatus.NO_CONTENT).send();
  })
);

router.delete(
  '/post/:postId',
  checkJwt,
  checkRole([Role.ADMIN]),
  wrapAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const postId = +req.params.postId;

    await postService.deletePost(postId, user);

    return res.status(HttpStatus.NO_CONTENT).send();
  })
);

router.delete(
  '/comment/:commentId',
  checkJwt,
  checkRole([Role.ADMIN]),
  wrapAsync(async (req: Request, res: Response) => {
    const commentId = +req.params.commentId;

    await commentService.deleteComment(commentId, 0);

    return res.status(HttpStatus.NO_CONTENT).send();
  })
);

export default router;
