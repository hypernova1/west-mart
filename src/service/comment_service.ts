import CommentRepository from '@repository/comment_repository';
import PostRepository from '@repository/post_repository';
import NotFoundError from '../error/not_found_error';
import ForbiddenError from '../error/forbidden_error';
import Comment from '@model/comment';
import User from '@model/user';
import { CommentForm } from '@payload/comment';

export default class CommentService {

    private commentRepository: CommentRepository;
    private postRepository: PostRepository;

    constructor() {
        this.commentRepository = new CommentRepository();
        this.postRepository = new PostRepository();
    }

    async registerComment(commentForm: CommentForm, user: User): Promise<number> {
        const post = await this.postRepository.findById(commentForm.postId);

        const comment = {
            content: commentForm.content,
            post: post,
            writer: user,
        } as Comment;

        return this.commentRepository.save(comment);
    }

    async deleteComment(id: number, userId: number): Promise<void> {
        const comment = await this.commentRepository.findByIdAndUserId(id, userId);

        if (!comment) {
            throw new NotFoundError('댓글이 존재하지 않습니다.');
        }

        if (comment.writer.id !== userId && userId !== 0) {
            throw new ForbiddenError('삭제 권한이 없습니다.');
        }
        await this.commentRepository.deleteById(id);
    }

    async updateComment(id: number, content: string, userId: number): Promise<void> {
        const comment = await this.commentRepository.findByIdAndUserId(id, userId);

        if (!comment) {
            throw new NotFoundError('댓글이 존재하지 않습니다.');
        }

        if (comment.writer.id !== userId) {
            throw new ForbiddenError('삭제 권한이 없습니다.');
        }

        await comment.update({
            content: content,
        });
    }
}