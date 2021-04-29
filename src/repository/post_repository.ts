import Post from '@model/post';
import { Op } from 'sequelize';

export default class PostRepository {

    getListByTitleLikeOrContentLike(pageNo: number, size: number, keyword: string): Promise<Array<Post>> {
        return Post.findAll({
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
                isActive: true,
            },
            offset: pageNo,
            limit: size,
            order: [
                ['createdAt', 'ASC']
            ]
        }).then((postList) => {
            return postList;
        }).catch((err: Error) => {
            console.log(err);
            return Promise.reject();
        });
    }

    save(post: Post): Promise<Post> {
        return Post.create(post)
            .then((post) => {
                return Promise.resolve(post);
            }).catch((err) => {
                console.log(err);
                return Promise.reject();
            });
    }

    findById(id: number): Promise<Post> {
        return Post.findOne({
            where: {
                id: id,
                isActive: true,
            },
        }).then((post) => {
            return post;
        }).catch((err) => {
            console.log(err);
            return Promise.reject();
        })
    }

    countByTitleLikeOrContentLike(keyword: string): Promise<number> {
        return Post.count({
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
                isActive: true,
            },
        }).then((count) => {
            return count;
        }).catch((err: Error) => {
            console.log(err);
            return Promise.reject();
        });
    }

}