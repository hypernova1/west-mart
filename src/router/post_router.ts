import { Router } from 'express';
import PostService from '../service/post_service';
import {PostListRequest, PostRequest} from '../dto/post_dto';

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

router.post('/', async (req, res, next) => {
    const postDto = req.body as PostRequest;
    postDto.userId = +req.user.id;

    const id: number | void = await postService.register(postDto);
    if (!id) {
        res.status(403).send();
    }

    res.setHeader('Location', `${req.get('host')}/post/${id}`);
    return res.status(201).send();
})

export default router;