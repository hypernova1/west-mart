import { Request, Response, Router } from 'express';
import { checkRole } from '@middleware/check-role';
import { checkJwt } from '@middleware/jwt';
import { Container } from 'typedi';
import validate from '@validate/index';
import postValidator from '@validate/post';
import PostService from '@service/post_service';
import CommentService from '@service/comment_service';
import Role from '@constant/role';
import { PostListRequest, PostForm } from '@payload/post';
import commentValidator from '@validate/comment';
import { CommentForm } from '@payload/comment';
import HttpStatus from '@constant/http_status';
import wrapAsync from '@util/async_wrapper';

const router = Router();
const postService = Container.get(PostService);
const commentService = Container.get(CommentService);

router.get(
  '/',
  checkJwt,
  checkRole([Role.ADMIN, Role.USER]),
  wrapAsync(async (req: Request, res: Response) => {
    const request: PostListRequest = {};
    request.pageNo = +req.query.pageNo || 1;
    request.size = +req.query.size || 10;
    request.keyword = (req.query.keyword as string) || '';

    const result = await postService.getPostList(request);
    res.status(HttpStatus.OK).json(result);
  })
);

router.get(
  '/:id',
  checkJwt,
  checkRole([Role.ADMIN, Role.USER]),
  wrapAsync(async (req: Request, res: Response) => {
    const postId = +req.params.id;
    const cookie = req.cookies.post;

    if (cookie) {
      if (cookie.indexOf(postId) === -1) {
        req.cookies.post += ',' + postId;
        await postService.increasePostHits(postId);
      }
    } else {
      req.cookies.post = postId;
    }

    const postDetail = await postService.getPostDetail(postId);
    return res.status(HttpStatus.OK).json(postDetail);
  })
);

router.post(
  '/',
  checkJwt,
  checkRole([Role.ADMIN, Role.USER]),
  validate(postValidator['create']),
  wrapAsync(async (req: Request, res: Response) => {
    const postDto = req.body as PostForm;
    const user = req.user;

    const id: number = await postService.createPost(postDto, user);
    if (!id) {
      res.status(403).send();
    }

    res.setHeader('Location', `${req.get('host')}/post/${id}`);
    return res.status(HttpStatus.CREATED).send();
  })
);

router.put(
  '/:id',
  checkJwt,
  checkRole([Role.ADMIN, Role.USER]),
  validate(postValidator['create']),
  wrapAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const postId = +req.params.id;
    const postForm = req.body as PostForm;

    await postService.updatePost(postForm, postId, user.id);

    return res.status(HttpStatus.NO_CONTENT).send();
  })
);

router.delete(
  '/:id',
  checkJwt,
  checkRole([Role.ADMIN, Role.USER]),
  wrapAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const postId = +req.params.id;

    await postService.deletePost(postId, user);

    return res.status(HttpStatus.NO_CONTENT).send();
  })
);

router.patch(
  '/:id/favorite',
  checkJwt,
  checkRole([Role.ADMIN, Role.USER]),
  wrapAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const id = +req.params.id;

    await postService.toggleFavorite(id, user);

    return res.status(HttpStatus.NO_CONTENT).send();
  })
);

router.get(
  '/:id/comment',
  wrapAsync(async (req: Request, res: Response) => {
    const postId = +req.params.id;
    const commentList = await commentService.getCommentList(postId);
    return res.status(HttpStatus.OK).json(commentList);
  })
);

router.post(
  '/:id/comment',
  checkJwt,
  checkRole([Role.ADMIN, Role.USER]),
  validate(commentValidator['create']),
  wrapAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const postId = +req.params.id;
    const commentForm = req.body as CommentForm;
    commentForm.postId = postId;

    const id = await commentService.registerComment(commentForm, user);

    res.setHeader('Location', `${req.get('host')}/comment/${id}`);
    return res.status(HttpStatus.CREATED).send();
  })
);

export default router;
