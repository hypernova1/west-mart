import sequelize from '@model/index';
import { Op } from 'sequelize';
import { Repository } from 'sequelize-typescript';
import { Service } from 'typedi';

import TagService from '@service/tag_service';
import Post from '@model/post';
import User from '@model/user';
import Role from '@constant/role';
import NotFoundError from '@error/not_found_error';
import ForbiddenError from '@error/forbidden_error';
import { PostDetail, PostForm, PostListDto, PostListRequest, PostSummary } from '@payload/post';
import FavoritePost from '@model/favorite_post';
import Category from '@model/category';
import Tag from '@model/tag';

const tagRepository = sequelize.getRepository(Tag);
const userRepository = sequelize.getRepository(User);

@Service()
export default class PostService {

    constructor(private postRepository: Repository<Post>,
                private tagService: TagService,
                private favoritePostRepository: Repository<FavoritePost>,
                private categoryRepository: Repository<Category>) {
        this.postRepository = sequelize.getRepository(Post);
        this.favoritePostRepository = sequelize.getRepository(FavoritePost);
        this.categoryRepository = sequelize.getRepository(Category);
    }

    async getPostList(request: PostListRequest): Promise<PostListDto>  {
        try {
            const postList = await this.postRepository.findAll({
                where: {
                    [Op.or]: [
                        { title: { [Op.like]: '%' + request.keyword + '%' } },
                        { content: { [Op.like]: '%' + request.keyword + '%' } },
                    ],
                    isActive: true,
                },
                offset: request.pageNo - 1,
                limit: request.pageNo * request.size,
                order: [
                    ['createdAt', 'ASC']
                ],
                include: [{
                    model: userRepository,
                    as: 'writer'
                }]
            });

            const postDtoList = postList.map((post: Post) => {
                return {
                    id: post.id,
                    title: post.title,
                    writer: post.writer.nickname,
                    regDate: post.createdAt
                } as PostSummary;
            });

            const totalCount = await this.postRepository.count({
                where: {
                    [Op.or]: [
                        { title: { [Op.like]: '%' + request.keyword + '%' } },
                        { content: { [Op.like]: '%' + request.keyword + '%' } },
                    ],
                    isActive: true,
                },
            });

            const totalPage = totalCount / request.size;
            const isExistNextPage = totalPage > request.pageNo;

            return {
                postList: postDtoList,
                isExistNextPage: isExistNextPage,
            } as PostListDto
        } catch (err) {
            console.log(err);
        }

    }

    async registerPost(postForm: PostForm, user: User): Promise<number> {
        const category = await this.categoryRepository.findOne({
            where: { id: postForm.categoryId,  isActive: true },
            include: [userRepository],
        });

        if (!category) {
            throw new NotFoundError('카테고리가 존재하지 않습니다.');
        }

        if (category.manager.id !== user.id) {
            throw new ForbiddenError('작성 권한이 없습니다.');
        }

        const post = {
            title: postForm.title,
            content: postForm.content,
            userId: user.id,
            categoryId: category.id,
        } as Post;

        const savedPost = await this.postRepository.create(post);

        const tags = await this.tagService.getListOrCreate(postForm.tags);
        await savedPost.$add('tags', tags);

        return savedPost.id;
    }

    async updatePost(postForm: PostForm, postId: number, userId: number): Promise<void> {
        const post = await this.postRepository.findOne({
            where: { id: postId,  isActive: true },
            include: [{ model: userRepository, as: 'writer' }]
        });

        if (!post) {
            throw new NotFoundError('글이 존재하지 않습니다.');
        }

        if (post.writer.id !== userId) {
            throw new ForbiddenError('수정 권한이 없습니다.');
        }

        await this.postRepository.update(
            { title: postForm.title,  content: postForm.content },
            { where: { id: postId } }
        );

        const tags = await this.tagService.getListOrCreate(postForm.tags);

        await post.$set('tags', tags);
    }

    async deletePost(id: number, user: User): Promise<void> {
        const post = await this.postRepository.findOne({ where: { id: id, isActive: true } });

        if (!post) {
            throw new NotFoundError('글이 존재하지 않습니다.');
        }

        if (post.writer !== user && user.role !== Role.ADMIN) {
            throw new ForbiddenError('삭제 권한이 없습니다.');
        }

        await this.postRepository.update(
            { isActive: false },
            { where: { id: id } }
        );
    }

    async getPostDetail(postId: number): Promise<PostDetail> {
        const post = await this.postRepository.findOne({
            where: { id: postId,  isActive: true },
            include: [
                { model: userRepository, as: 'writer' },
                { model: tagRepository, as: 'tags' }
            ]
        });

        if (!post) {
            throw new NotFoundError('글이 존재하지 않습니다.');
        }

        const tagNames = await post.tags.map((tag) => tag.name);

        return {
            id: post.id,
            title: post.title,
            content: post.content,
            writerId: post.writer.id,
            tags: tagNames,
            writerName: post.writer.nickname,
        } as PostDetail;
    }

    toggleFavorite(id: number, user: User) {
        sequelize.transaction().then(async (t) => {
            try {
                const post = await this.postRepository.findOne({
                    where: { id: id, isActive: true },
                    include: [tagRepository, userRepository],
                    transaction: t,
                });

                if (!post) {
                    new NotFoundError('글이 존재하지 않습니다.');
                }

                const favoritePost = await this.favoritePostRepository.findOne({
                    where: { userId: user.id,  postId: post.id },
                    transaction: t,
                });

                if (favoritePost) {
                    await post.$remove('favorites', user);
                    await post.decrement({ favorite: 1 });

                } else {
                    await post.$add('favorites', user);
                    await post.increment({ favorite: 1 });
                }
            } catch (err) {
                await t.rollback();
            }
        });

    }

    async increasePostHits(id: number) {
        const post = await this.postRepository.findOne({ where: { id: id } });
        await post.increment({ hits: 1 });
    }
}