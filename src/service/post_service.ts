import sequelize from '../models';
import PostRepository from '../repository/post_repository';
import FavoritePostRepository from '../repository/favorite_post_repository';
import CategoryRepository from '../repository/category_repository';
import Post from '../models/post';
import { PostSummary, PostListRequest, PostForm, PostDetail, PostListDto } from '../payload/post';
import User from '../models/user';

const postRepository = new PostRepository();
const favoritePostRepository = new FavoritePostRepository();
const categoryRepository = new CategoryRepository();

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

        const post = {
            title: postForm.title,
            content: postForm.content,
            writer: user,
            category: category,
        } as Post;

        return await postRepository.save(post);
    }

    async updatePost(postForm: PostForm, postId: number, userId: number): Promise<void> {
        const post = await postRepository.findById(postId);

        if (!post || post.writer.id !== userId) {
            return Promise.reject();
        }

        await post.update({
            id: postId,
            title: postForm.title,
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
        return {
            id: post.id,
            title: post.title,
            content: post.content,
            writerId: post.writer.id,
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