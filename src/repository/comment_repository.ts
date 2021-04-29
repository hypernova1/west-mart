import Comment from '@model/comment';

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

    async findByIdAndUserId(id: number, userId: number): Promise<Comment> {
        return Comment.findOne({
            where: {
                id: id,
                userId: userId,
                isActive: true,
            }
        }).then((comment) => {
            return comment;
        }).catch((err: Error) => {
            console.log(err);
            return Promise.reject();
        });
    }
}