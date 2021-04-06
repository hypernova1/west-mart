import CommentRepository from '../repository/comment_repository';
import {CommentForm} from '../payload/comment_dto';

const commentRepository = new CommentRepository();

export default class CommentService {

    async registerComment(commentForm: CommentForm) {
        return await commentRepository.create(commentForm);
    }
}