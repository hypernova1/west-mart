import { Service } from 'typedi';
import { Repository } from 'sequelize-typescript';

import NotFoundError from '@error/not_found_error';
import ForbiddenError from '@error/forbidden_error';
import Comment from '@model/comment';
import User from '@model/user';
import { CommentDetail, CommentForm, CommentResponse } from '@payload/comment';
import { dateToString } from '@util/common';
import Post from '@model/post';
import sequelize from '@model/index';
import Tag from '@model/tag';

const userRepository = sequelize.getRepository(User);
const tagRepository = sequelize.getRepository(Tag);

@Service()
export default class CommentService {
  constructor(
    private commentRepository: Repository<Comment>,
    private postRepository: Repository<Post>
  ) {
    this.commentRepository = sequelize.getRepository(Comment);
    this.postRepository = sequelize.getRepository(Post);
  }

  async registerComment(commentForm: CommentForm, user: User): Promise<number> {
    const post = await this.postRepository.findOne({
      where: { id: commentForm.postId },
      include: [
        { model: tagRepository, as: 'tags' },
        { model: userRepository, as: 'writer' },
      ],
    });

    if (!post) {
      throw new NotFoundError('글이 존재하지 않습니다.');
    }

    const comment = (await post.$create('comment', {
      content: commentForm.content,
      userId: user.id,
      postId: post.id,
    })) as Comment;

    return comment.id;
  }

  async deleteComment(id: number, userId: number): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id: id, userId: userId },
      include: [{ model: userRepository, as: 'writer' }],
    });

    if (!comment) {
      throw new NotFoundError('댓글이 존재하지 않습니다.');
    }

    if (comment.writer.id !== userId && userId !== 0) {
      throw new ForbiddenError('삭제 권한이 없습니다.');
    }

    await comment.destroy();
  }

  async updateComment(
    id: number,
    content: string,
    userId: number
  ): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id: id, userId: userId },
    });

    if (!comment) {
      throw new NotFoundError('댓글이 존재하지 않습니다.');
    }

    if (comment.writer.id !== userId) {
      throw new ForbiddenError('삭제 권한이 없습니다.');
    }

    await comment.update({ content: content });
  }

  async getCommentList(postId: number): Promise<CommentResponse> {
    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new NotFoundError('post not found');
    }

    const commentList = await post.$get('comments', {
      include: [{ model: userRepository, as: 'writer' }],
    });

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
