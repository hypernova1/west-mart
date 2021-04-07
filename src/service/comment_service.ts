import CommentRepository from '../repository/comment_repository';
import {CommentForm} from '../payload/comment_dto';

const commentRepository = new CommentRepository();

export default class CommentService {

    registerComment(commentForm: CommentForm) {
        return commentRepository.create(commentForm);
    }
}