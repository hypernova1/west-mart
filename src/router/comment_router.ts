import { Router } from 'express';
import CommentService from '../service/comment_service';
import { CommentForm } from '../payload/comment_dto';

const router = Router();
const commentService = new CommentService();

router.post('/', async (req, res, next) => {
    const commentForm = req.body as CommentForm;

    const id = await commentService.registerComment(commentForm);

    res.setHeader('Location', `${req.get('host')}/comment/${id}`);
    return res.status(201).send();
});

export default router;