import sequelize from '../models';
import PostRepository from '../repository/post_repository';
import FavoritePostRepository from '../repository/favorite_post_repository';
import CategoryRepository from '../repository/category_repository';
import TagService from '../service/tag_service';
import Post from '../models/post';
import { PostSummary, PostListRequest, PostForm, PostDetail, PostListDto } from '../payload/post';
import User from '../models/user';
import Tag from '../models/tag';

const postRepository = new PostRepository();
const favoritePostRepository = new FavoritePostRepository();
const categoryRepository = new CategoryRepository();
const tagService = new TagService();

export default class PostService {

    async getPostList(request: PostListRequest): Promise<PostListDto>  {

        const postList = await postRepository.getListByTitleLikeOrContentLike(request.pageNo, request.size, request.keyword);
        const postDtoList = postList.map((post: Post) => {
            return {
                id: post.id,
                title: post.title,
                writer: post.writer.nickname,
                regDate: post.createdAt
            } as PostSummary;
        });

        const totalCount = await postRepository.countByTitleLikeOrContentLike(request.keyword);
        const totalPage = totalCount / request.size;
        const isExistNextPage = totalPage > request.pageNo;

        return {
            postList: postDtoList,
            isExistNextPage: isExistNextPage,
        } as PostListDto
    }

    async registerPost(postForm: PostForm, user: User): Promise<number> {

        const category = await categoryRepository.findById(postForm.categoryId);

        if (!category || category.manager !== user) {
            return Promise.reject();
        }

        const tags = await tagService.getListOrCreate(postForm.tags);

        const post = {
            title: postForm.title,
            content: postForm.content,
            writer: user,
            tags: tags,
            category: category,
        } as Post;

        const savedPost = await postRepository.save(post);

        return savedPost.id;
    }

    async updatePost(postForm: PostForm, postId: number, userId: number): Promise<void> {
        const post = await postRepository.findById(postId);

        if (!post || post.writer.id !== userId) {
            return Promise.reject();
        }

        const tags = await tagService.getListOrCreate(postForm.tags);

        await post.update({
            id: postId,
            title: postForm.title,
            tags: tags,
            content: postForm.content,
        });
    }

    async deletePost(id: number, userId: number): Promise<void> {
        const post = await postRepository.findById(id);

        if (!post || post.writer.id !== userId) {
            return Promise.reject();
        }

        await post.update({
            isActive: false,
        })
    }

    async getPostDetail(postId: number): Promise<PostDetail> {
        const post = await postRepository.findById(postId);
        if (!post) {
            return Promise.reject();
        }

        const tagNames = post.tags.map((tag) => tag.name);

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
            const post = await postRepository.findById(id);
            if (!post) {
                return Promise.reject();
            }

            const favoritePost = await favoritePostRepository.getByUserIdAndPostId(user.id, post.id);

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
}