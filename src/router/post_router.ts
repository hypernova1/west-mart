import { Router } from 'express';
import PostService from '../service/post_service';
import { PostListRequest, PostForm } from '../payload/post_dto';

const router = Router();
const postService = new PostService();

router.get('/', async (req, res, next) => {
    const request: PostListRequest = {};
    request.pageNo = +req.query.pageNo || 1;
    request.size = +req.query.size || 10;
    request.keyword = req.query.keyword as string || '';

    const result = await postService.getPostList(request);
    res.status(200).json(result);
});

router.get('/:id', async (req, res, next) => {
    const postId = +req.params.id;
    const postDetail = await postService.getPostDetail(postId);

    return res.status(200).json(postDetail);
})

router.post('/', async (req, res, next) => {
    const postDto = req.body as PostForm;
    postDto.userId = +req.user.id;

    const id: number | void = await postService.registerPost(postDto);
    if (!id) {
        res.status(403).send();
    }

    res.setHeader('Location', `${req.get('host')}/post/${id}`);
    return res.status(201).send();
})

router.put('/:id', async (req, res, next) => {
    const postId  = +req.params.id;
    const postDto = req.body as PostForm;
    await postService.updatePost(postId, postDto);

    return res.status(200).send();
});

router.delete('/:id', async (req, res, next) => {
    const id = +req.params.id;

    await postService.deletePost(id);
    return res.status(204).send();
});

export default router;