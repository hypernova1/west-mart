import Comment from '../models/comment';
import { CommentForm } from '../payload/comment_dto';

export default class PostRepository {

    create(commentForm: CommentForm): Promise<number> {
        return Comment.create(commentForm)
            .then((comment) => {
                return comment.id;
            });
    }

    deleteById(id: number): Promise<number> {
        return Comment.update({
            isActive: false,
        }, {
            where: {
                id: id,
            }
        }).then((result) => {
            return result[0];
        });
    }
}