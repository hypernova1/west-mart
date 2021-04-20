import CommentRepository from '../repository/comment_repository';
import PostRepository from '../repository/post_repository';
import { CommentForm } from '../payload/comment';
import Comment from '../models/comment';
import User from '../models/user';

const commentRepository = new CommentRepository();
const postRepository = new PostRepository();

export default class CommentService {

    async registerComment(commentForm: CommentForm, user: User): Promise<number> {
        const post = await postRepository.findById(commentForm.postId);

        const comment = {
            content: commentForm.content,
            post: post,
            writer: user,
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

        if (!comment || comment.writer.id !== userId) {
            return Promise.reject();
        }

        await comment.update({
            content: content,
        });
    }
}