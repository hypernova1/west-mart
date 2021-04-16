import Post from '../models/post';
import { Op } from 'sequelize';
import { PostForm } from '../payload/post';

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
        });
    }

    save(postDto: PostForm): Promise<number | void> {
        return Post.create(postDto)
            .then((post) => {
                return post.id;
            }).catch((err) => {
                console.log(err);
                return Promise.reject();
            });
    }

    update(id: number, postDto: PostForm) {
        return Post.update(postDto, {
            where: {
                id: id
            }
        }).then(() => {
            return Promise.resolve();
        }).catch((err) => {
            console.log(err);
            return Promise.reject();
        });
    }

    deleteById(id: number) {
        return Post.update({
            isActive: false,
        }, {
            where: {
                id: id,
            }
        }).then(() => {
            return Promise.resolve();
        }).catch((err) => {
            console.log(err);
            return Promise.reject();
        });
    }

    getById(id: number) {
        return Post.findOne({
            where: {
                id: id,
                isActive: true,
            }
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
        });
    }

    async existsById(id: number) {
        return Post.count({
            where: {
                id: id,
                isActive: true,
            }
        }).then((count) => {
            return !!count;

        })
    }
}