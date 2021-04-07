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
})

router.delete('/:id', async (req, res, next) => {
    const id = +req.params.id;

    const isDeleted = await commentService.deleteComment(id);
    if (!isDeleted) {
        return res.status(400).send();
    }

    return res.status(204).send();
});

export default router;