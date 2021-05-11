import { Router } from 'express';
import { checkJwt } from '@middleware/jwt';
import { checkRole } from '@middleware/check-role';
import AdminService from '@service/admin_service';
import PostService from '@service/post_service';
import CommentService from "@service/comment_service";
import errorHandler from '@util/error_handler';
import Role from '@constant/role';
import { Container } from 'typedi';

const router = Router();
const adminService = Container.get(AdminService);
const postService = Container.get(PostService);
const commentService = Container.get(CommentService);

router.patch('/user/:userId/approve', checkJwt, checkRole([Role.ADMIN]), async (req, res, next) => {
    try {
        const userId = +req.params.userId;

        await adminService.approveUser(userId);

        return res.status(200).send();
    } catch (err) {
        return errorHandler(res, err);
    }

});

router.delete('/post/:postId', checkJwt, checkRole([Role.ADMIN]), async (req, res, next) => {
    const user = req.user;
    const postId = +req.params.postId;

    await postService.deletePost(postId, user);

    return res.status(200).send();
});

router.delete('/comment/:commentId', checkJwt, checkRole([Role.ADMIN]), async (req, res, next) => {
    const commentId = +req.params.commentId;

    await commentService.deleteComment(commentId, 0);

    return res.status(200).send();
});

export default router;