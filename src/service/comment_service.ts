import CommentRepository from '../repository/comment_repository';
import { CommentForm } from '../payload/comment';
import Comment from '../models/comment';

const commentRepository = new CommentRepository();

export default class CommentService {

    registerComment(commentForm: CommentForm, userId: number): Promise<number> {
        const comment = {
            content: commentForm.content,
            postId: commentForm.postId,
            userId: userId,
        } as Comment;

        return commentRepository.save(comment);
    }

    async deleteComment(id: number, userId: number): Promise<boolean> {
        const comment = await commentRepository.findByIdAndUserId(id, userId);

        if (!comment) {
            return Promise.reject();
        }

        await commentRepository.deleteById(id);
    }

    async updateComment(id: number, content: string, userId: number): Promise<void> {
        const comment = await commentRepository.findByIdAndUserId(id, userId);

        if (!comment || comment.userId !== userId) {
            return Promise.reject();
        }

        await comment.update({
            content: content,
        });
    }
}