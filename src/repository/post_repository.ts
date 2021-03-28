import Post from '../models/post';
import { Op } from 'sequelize';

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
}