import {NextFunction, Request, Response, Router} from 'express';
import PostService from '../service/post_service';
import { PostListRequest, PostForm } from '../payload/post';
import {checkRole} from '../middleware/check-role';
import {checkJwt} from '../middleware/jwt';

const router = Router();
const postService = new PostService();

router.get('/', checkJwt, checkRole(["ADMIN", "USER"]), async (req, res, next) => {
    const request: PostListRequest = {};
    request.pageNo = +req.query.pageNo || 1;
    request.size = +req.query.size || 10;
    request.keyword = req.query.keyword as string || '';

    const result = await postService.getPostList(request);
    res.status(200).json(result);
});

router.get('/:id', checkJwt, checkRole(["ADMIN", "USER"]), async (req, res, next) => {
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
        return res.status(404).send();
    }
});

router.post('/', checkJwt, checkRole(["ADMIN", "USER"]), async (req, res, next) => {
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
        console.log(err);
        return res.status(403).send();
    }
})

router.put('/:id', checkJwt, checkRole(["ADMIN", "USER"]), async (req, res, next) => {
    try {
        const user = req.user;
        const postId  = +req.params.id;
        const postForm = req.body as PostForm;

        await postService.updatePost(postForm, postId, user.id);

        return res.status(200).send();
    } catch (err) {
        console.log(err);
        return res.status(403).send();
    }

});

router.delete('/:id', checkJwt, checkRole(["ADMIN", "USER"]), async (req, res, next) => {
    const userId = req.user.id;
    const postId = +req.params.id;

    await postService.deletePost(postId, userId);

    return res.status(204).send();
});

router.patch('/:id/favorite', checkJwt, checkRole(["ADMIN", "USER"]), async (req, res, next) => {
    try {
        const user = req.user;
        const id = +req.params.id;

        await postService.toggleFavorite(id, user);

        return res.status(204).send();
    } catch (err) {
        console.log(err);
        return res.status(404).send();
    }
});

export default router;