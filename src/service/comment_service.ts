import CommentRepository from '../repository/comment_repository';
import { CommentForm } from '../payload/comment';

const commentRepository = new CommentRepository();

export default class CommentService {

    registerComment(commentForm: CommentForm) {
        return commentRepository.create(commentForm);
    }

    async deleteComment(id: number): Promise<boolean> {
        const deleteCount = await commentRepository.deleteById(id);

        return deleteCount === 1;
    }

    async updateComment(id: number, content: string, userId: number) {
        const comment = await commentRepository.findByIdAndUserId(id, userId);
        if (!comment) {
            return Promise.reject();
        }

        await comment.update({
            content: content,
        });
    }
}