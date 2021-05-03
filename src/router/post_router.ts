import { Router } from 'express';
import { checkRole } from '@middleware/check-role';
import { checkJwt } from '@middleware/jwt';
import validate from '@validate/index';
import postValidator from '@validate/post';
import PostService from '@service/post_service';
import errorHandler from '@util/error_handler';
import Role from '@constant/role';
import { PostListRequest, PostForm } from '@payload/post';

const router = Router();
const postService = new PostService();

router.get('/', checkJwt, checkRole([Role.ADMIN, Role.USER]), async (req, res, next) => {
    const request: PostListRequest = {};
    request.pageNo = +req.query.pageNo || 1;
    request.size = +req.query.size || 10;
    request.keyword = req.query.keyword as string || '';

    const result = await postService.getPostList(request);
    res.status(200).json(result);
});

router.get('/:id', checkJwt, checkRole([Role.ADMIN, Role.USER]), async (req, res, next) => {
    try {
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
        return res.status(200).json(postDetail);
    } catch (err) {
        return errorHandler(res, err);
    }
});

router.post('/', checkJwt, checkRole([Role.ADMIN, Role.USER]), validate(postValidator['register']), async (req, res, next) => {
    try {
        const postDto = req.body as PostForm;
        const user = req.user;

        const id: number | void = await postService.registerPost(postDto, user);
        if (!id) {
            res.status(403).send();
        }

        res.setHeader('Location', `${req.get('host')}/post/${id}`);
        return res.status(201).send();
    } catch (err) {
        return errorHandler(res, err);
    }
})

router.put('/:id', checkJwt, checkRole([Role.ADMIN, Role.USER]), validate(postValidator['register']), async (req, res, next) => {
    try {
        const user = req.user;
        const postId  = +req.params.id;
        const postForm = req.body as PostForm;

        await postService.updatePost(postForm, postId, user.id);

        return res.status(200).send();
    } catch (err) {
        return errorHandler(res, err);
    }

});

router.delete('/:id', checkJwt, checkRole([Role.ADMIN, Role.USER]), async (req, res, next) => {
    const user = req.user;
    const postId = +req.params.id;

    await postService.deletePost(postId, user);

    return res.status(204).send();
});

router.patch('/:id/favorite', checkJwt, checkRole([Role.ADMIN, Role.USER]), async (req, res, next) => {
    try {
        const user = req.user;
        const id = +req.params.id;

        await postService.toggleFavorite(id, user);

        return res.status(204).send();
    } catch (err) {
        return errorHandler(res, err);
    }
});

export default router;