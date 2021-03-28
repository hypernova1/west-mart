import Post from '../models/post';
import { Op } from 'sequelize';
import { PostRequest } from '../dto/post_dto';

export default class PostRepository {

    getList(pageNo: number, size: number, keyword: string) {
        return Post.findAndCountAll({
            where: {
                [Op.or]: [
                    {
                        title: {
                            [Op.like]: '%' + keyword + '%'
                        }
                    },
                    {
                        content: {
                            [Op.like]: '%' + keyword + '%'
                        }
                    }
                ],
            },
            offset: pageNo,
            limit: size,
            order: [
                ['createdAt', 'ASC']
            ]
        });
    }

    save(postDto: PostRequest): Promise<number | void> {
        return Post.create(postDto)
            .then((post) => {
                return post.id;
            }).catch((err) => {
                console.log(err);
            });
    }
}