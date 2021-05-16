import sequelize from '@model/index';
import PostRepository from '@repository/post_repository';
import FavoritePostRepository from '@repository/favorite_post_repository';
import CategoryRepository from '@repository/category_repository';
import TagService from '@service/tag_service';
import Post from '@model/post';
import User from '@model/user';
import Role from '@constant/role';
import NotFoundError from '../error/not_found_error';
import ForbiddenError from '../error/forbidden_error';
import { PostDetail, PostForm, PostListDto, PostListRequest, PostSummary } from '@payload/post';
import { Service } from 'typedi';
import PostTag from '@model/post_tag';
import PostTagRepository from '@repository/post_tag_repository';

@Service()
export default class PostService {

    constructor(private postRepository: PostRepository,
                private favoritePostRepository: FavoritePostRepository,
                private categoryRepository: CategoryRepository,
                private tagService: TagService,
                private postTagRepository: PostTagRepository) {}

    async getPostList(request: PostListRequest): Promise<PostListDto>  {
        const postList = await this.postRepository.getListByTitleLikeOrContentLike(request.pageNo, request.size, request.keyword);
        const postDtoList = postList.map((post: Post) => {
            return {
                id: post.id,
                title: post.title,
                writer: post.writer.nickname,
                regDate: post.createdAt
            } as PostSummary;
        });

        const totalCount = await this.postRepository.countByTitleLikeOrContentLike(request.keyword);
        const totalPage = totalCount / request.size;
        const isExistNextPage = totalPage > request.pageNo;

        return {
            postList: postDtoList,
            isExistNextPage: isExistNextPage,
        } as PostListDto
    }

    async registerPost(postForm: PostForm, user: User): Promise<number> {

        const category = await this.categoryRepository.findById(postForm.categoryId);

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

        const savedPost = await this.postRepository.save(post);

        const tags = await this.tagService.getListOrCreate(postForm.tags);
        const postTags = tags.map((tag) => {
            return {
                postId: savedPost.id,
                tagId: tag.id,
            } as PostTag
        });

        await this.postTagRepository.saveAll(postTags);

        return savedPost.id;
    }

    async updatePost(postForm: PostForm, postId: number, userId: number): Promise<void> {
        const post = await this.postRepository.findById(postId);

        if (!post) {
            throw new NotFoundError('글이 존재하지 않습니다.');
        }

        if (post.writer.id !== userId) {
            throw new ForbiddenError('수정 권한이 없습니다.');
        }

        await post.update({
            id: postId,
            title: postForm.title,
            content: postForm.content,
        });

        const tags = await this.tagService.getListOrCreate(postForm.tags);

        const postTags = tags.map((tag) => {
            return {
                postId: post.id,
                tagId: tag.id,
            } as PostTag;
        });

        await this.postTagRepository.deleteAll(postId);
        await this.postTagRepository.saveAll(postTags);
    }

    async deletePost(id: number, user: User): Promise<void> {
        const post = await this.postRepository.findById(id);

        if (!post) {
            throw new NotFoundError('글이 존재하지 않습니다.');
        }

        if (post.writer !== user && user.role !== Role.ADMIN) {
            throw new ForbiddenError('삭제 권한이 없습니다.');
        }

        await post.update({
            isActive: false,
        })
    }

    async getPostDetail(postId: number): Promise<PostDetail> {
        const post = await this.postRepository.findById(postId);
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
            const post = await this.postRepository.findById(id);
            if (!post) {
                new NotFoundError('글이 존재하지 않습니다.');
            }

            const favoritePost = await this.favoritePostRepository.getByUserIdAndPostId(user.id, post.id);

            if (favoritePost) {
                await post.$remove('favorites', user);
                await post.decreaseFavorite();

            } else {
                await post.$add('favorites', user);
                await post.increaseFavorite();
            }

            await t.commit();
        });
    }

    async increasePostHits(id: number) {
        const post = await this.postRepository.findById(id);
        await post.increment({ hits: 1 });
    }
}