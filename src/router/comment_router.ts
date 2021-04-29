import { Router } from 'express';
import { checkJwt } from '@middleware/jwt';
import { checkRole } from '@middleware/check-role';
import validate from '@validate/index';
import commentValidator from '@validate/comment';
import errorHandler from '@util/error_handler';
import User from '@model/user';
import CommentService from '@service/comment_service';
import { CommentForm } from '@payload/comment';

const router = Router();
const commentService = new CommentService();

router.post('/', checkJwt, checkRole(["ADMIN", "USER"]), validate(commentValidator['register']), async (req, res, next) => {
    const user = req.user;
    const commentForm = req.body as CommentForm;

    const id = await commentService.registerComment(commentForm, user);

    res.setHeader('Location', `${req.get('host')}/comment/${id}`);
    return res.status(201).send();
})

router.delete('/:id', checkJwt, checkRole(["ADMIN", "USER"]), async (req, res, next) => {
    try {
        const user = req.user as User;
        const commentId = +req.params.id;

        await commentService.deleteComment(commentId, user.id);

        return res.status(204).send();
    } catch (err) {
        return errorHandler(res, err);
    }
});

router.put('/:id', checkJwt, checkRole(["ADMIN", "USER"]), validate(commentValidator['update']), async (req, res, next) => {
    try {
        const userId: number = req.user.id;
        const id: number = +req.params.id;
        const content: string = req.body.content;

        await commentService.updateComment(id, content, userId);

        return res.status(204).send();
    } catch (err) {
        return errorHandler(res, err);
    }

})

export default router;