import CommentRepository from '@repository/comment_repository';
import PostRepository from '@repository/post_repository';
import {CommentForm} from '@payload/comment';
import Comment from '@model/comment';
import User from '@model/user';
import ResponseEntity from '@payload/response_entity';
import HttpStatus from '@constant/http_status';

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
            return Promise.reject(
                ResponseEntity.notFound({ message: '댓글이 존재하지 않습니다.' })
            );
        }

        if (comment.writer.id !== userId && userId !== 0) {
            return Promise.reject(
                ResponseEntity.forbidden({ message: '삭제 권한이 없습니다.' })
            )
        }
        await commentRepository.deleteById(id);
    }

    async updateComment(id: number, content: string, userId: number): Promise<void> {
        const comment = await commentRepository.findByIdAndUserId(id, userId);

        if (!comment) {
            return Promise.reject(
                ResponseEntity.notFound({ message: '댓글이 존재하지 않습니다.' })
            );
        }

        if (comment.writer.id !== userId) {
            ResponseEntity.forbidden({ message: '삭제 권한이 없습니다.'})
        }

        await comment.update({
            content: content,
        });
    }
}