import { Router } from 'express';
import CommentService from '@service/comment_service';
import { CommentForm } from '@payload/comment';
import {checkJwt} from '@middleware/jwt';
import {checkRole} from '@middleware/check-role';

const router = Router();
const commentService = new CommentService();

router.post('/', checkJwt, checkRole(["ADMIN"]), async (req, res, next) => {
    const user = req.user;
    const commentForm = req.body as CommentForm;

    const id = await commentService.registerComment(commentForm, user);

    res.setHeader('Location', `${req.get('host')}/comment/${id}`);
    return res.status(201).send();
})

router.delete('/:id', checkJwt, checkRole(["ADMIN"]), async (req, res, next) => {
    try {
        const userId = req.user.id;
        const commentId = +req.params.id;

        await commentService.deleteComment(commentId, userId);

        return res.status(204).send();
    } catch (err) {
        console.log(err);
        return res.status(403).send();
    }
});

router.put('/:id', checkJwt, checkRole(["ADMIN"]), async (req, res, next) => {
    try {
        const userId: number = req.user.id;
        const id: number = +req.params.id;
        const content: string = req.body.content;

        await commentService.updateComment(id, content, userId);

        return res.status(204).send();
    } catch (err) {
        return res.status(400).send();
    }

})

export default router;