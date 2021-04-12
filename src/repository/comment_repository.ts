import Comment from '../models/comment';
import { CommentForm } from '../payload/comment';

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

    async existsByIdAndUserId(id: number, userId: number): Promise<boolean> {
        return Comment.findOne({
            where: {
                id: id,
                userId: userId,
            }
        }).then((comment) => {
            if (!comment) return false;
            return true;
        })
    }

    async update(id: number, content: string) {
        await Comment.update({content: content}, {
            where: {
                id: id
            }
        });
    }
}