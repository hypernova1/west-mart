import Comment from '@model/comment';
import User from '@model/user';
import { Service } from 'typedi';

@Service()
export default class PostRepository {

    save(comment: Comment): Promise<number> {
        return Comment.create(comment)
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

    findByIdAndUserId(id: number, userId: number): Promise<Comment> {
        return Comment.findOne({
            where: {
                id: id,
                userId: userId,
                isActive: true,
            },
            include: [
                {
                    model: User,
                    as: 'writer',
                }
            ]
        }).then((comment) => {
            return comment;
        }).catch((err: Error) => {
            console.log(err);
            return Promise.reject();
        });
    }

    findAllByPostId(postId: number) {
        return Comment.findAll({
            where: {
                postId: postId,
                isActive: true,
            },
            include: [
                {
                    model: User,
                    as: 'writer',
                }
            ]
        }).then((comments) => {
            return comments;
        }).catch((err: Error) => {
            console.log(err);
            return Promise.reject();
        });
    }
}