import { User } from "../../models/user";
import { Post } from "../../models/post";

export const getUser = (userId: number) => {
    return User.findOne({
        where: { id: userId },
        include: [{
            model: Post,
            as: 'Posts',
            attributes: ['id'],
        }],
        attributes: {
            exclude: ['password'],
        },
    });
}
