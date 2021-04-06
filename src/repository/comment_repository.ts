import Comment from '../models/comment';
import { CommentForm } from '../payload/comment_dto';

export default class PostRepository {

    async create(commentForm: CommentForm): Promise<number> {
        return Comment.create(commentForm)
            .then((comment) => {
                return comment.id;
            });
    }
}