import { Router } from 'express';
import PostService from '../service/post_service';
import { PostListRequest } from '../dto/post_dto';

const router = Router();
const postService = new PostService();

router.get('/', async (req, res, next) => {

    const request: PostListRequest = {};
    request.pageNo = +req.query.pageNo;
    request.size = +req.query.size;
    request.keyword = req.query.keyword as string;

    const result = await postService.getPostList(request);
    res.status(200).json(result);
});

export default router;