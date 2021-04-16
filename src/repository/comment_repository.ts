import Comment from '../models/comment';
import { CommentForm } from '../payload/comment';

export default class PostRepository {

    create(commentForm: CommentForm): Promise<number> {
        return Comment.create(commentForm)
            .then((comment) => {
                return comment.id;
            }).catch((err: Error) => {
                console.log(err);
                return Promise.reject();
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
        }).catch((err: Error) => {
            console.log(err);
            return Promise.reject();
        });
    }

    existsByIdAndUserId(id: number, userId: number): Promise<boolean> {
        return Comment.count({
            where: {
                id: id,
                userId: userId,
                isActive: true,
            }
        }).then((count) => {
            return !!count;
        }).catch((err: Error) => {
            console.log(err);
            return Promise.reject();
        });
    }

    update(id: number, content: string) {
        Comment.update({
            content: content
        }, {
            where: {
                id: id,
            }
        }).then(() => {
            return Promise.resolve();
        }).catch((err: Error) => {
            console.log(err);
            return Promise.reject();
        });
    }
}