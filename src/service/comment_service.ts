import CommentRepository from '@repository/comment_repository';
import PostRepository from '@repository/post_repository';
import NotFoundError from '../error/not_found_error';
import ForbiddenError from '../error/forbidden_error';
import Comment from '@model/comment';
import User from '@model/user';
import { CommentDetail, CommentForm, CommentResponse } from '@payload/comment';
import { dateToString } from '@util/common';
import { Service } from 'typedi';

@Service()
export default class CommentService {

    constructor(private commentRepository: CommentRepository,
                private postRepository: PostRepository) {
    }

    async registerComment(commentForm: CommentForm, user: User): Promise<number> {
        const post = await this.postRepository.findById(commentForm.postId);

        if (!post) {
            throw new NotFoundError('글이 존재하지 않습니다.');
        }

        const comment = {
            content: commentForm.content,
            userId: user.id,
            postId: post.id,
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

        console.log(1);

        await comment.update({
            content: content,
        });
    }

    async getCommentList(postId: number): Promise<CommentResponse> {
        const commentList = await this.commentRepository.getCommentListByPostId(postId);

        const commentDtoList = commentList.map((comment) => {
            return {
                id: comment.id,
                content: comment.content,
                writer: {
                    id: comment.writer.id,
                    nickname: comment.writer.nickname,
                },
                createdAt: dateToString(comment.createdAt),
            } as CommentDetail;
        });

        return {
            commentList: commentDtoList,
            totalCount: commentList.length,
        } as CommentResponse;
    }
}