import Post from '../models/post';
import { Op } from 'sequelize';
import { PostForm } from '../payload/post';
import User from '../models/user';
import Comment from '../models/comment';

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

    save(postDto: PostForm): Promise<number | void> {
        return Post.create(postDto)
            .then((post) => {
                return post.id;
            }).catch((err) => {
                console.log(err);
                return Promise.reject();
            }).catch((err: Error) => {
                console.log(err);
                return Promise.reject();
            });
    }

    update(post: Post) {
        return Post.update(post, {
            where: {
                id: post.id
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

    getById(id: number): Promise<Post> {
        return Post.findOne({
            where: {
                id: id,
                isActive: true,
            },
            include: [
                {
                    model: User,
                    as: 'favorites',
                    through: {
                        attributes: [],
                    },
                    required: false,
                },
            ],
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

    existsById(id: number) {
        return Post.count({
            where: {
                id: id,
                isActive: true,
            }
        }).then((count) => {
            return !!count;
        }).catch((err: Error) => {
            console.log(err);
            return Promise.reject();
        });
    }

    increaseFavoriteCount(id: number) {
        Post.increment({
            favorite: +1
        }, {
            where: {
                id: id,
            }
        }).then(() => {
            return Promise.resolve();
        });
    }

    decreaseFavoriteCount(id: number) {
        Post.increment({
            favorite: -1
        }, {
            where: {
                id: id,
            }
        }).then(() => {
            return Promise.resolve();
        });
    }
}