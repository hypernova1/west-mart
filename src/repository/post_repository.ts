import Post from '../models/post';
import { Op } from 'sequelize';
import { PostForm } from '../payload/post_dto';

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

    async deleteById(id: number) {
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

    async getById(id: number) {
        return Post.findOne({
            where: {
                id: id,
            }
        }).then((post) => {
            return post;
        }).catch((err) => {
            console.log(err);
            return Promise.reject();
        })
    }
}