import sequelize from '../models';
import PostRepository from '../repository/post_repository';
import Post from '../models/post';
import { PostDto, PostListRequest, PostForm, PostDetail } from '../payload/post';
import User from '../models/user';
import FavoritePostRepository from '../repository/favorite_post_repository';

const postRepository = new PostRepository();
const favoritePostRepository = new FavoritePostRepository();

export default class PostService {

    async getPostList(request: PostListRequest)  {
        const postList = await postRepository.getListByTitleLikeOrContentLike(request.pageNo, request.size, request.keyword);
        const postDtoList = postList.map((post: Post) => {
            return {
                id: post.id,
                title: post.title,
                content: post.content,
                writer: post.writer.nickname,
                regDate: post.createdAt
            } as PostDto
        });

        const totalCount = await postRepository.countByTitleLikeOrContentLike(request.keyword);
        const totalPage = totalCount / request.size;
        const isExistNextPage = totalPage > request.pageNo;

        return {
            postList: postDtoList,
            isExistNextPage: isExistNextPage,
        }
    }

    async registerPost(postDto: PostForm): Promise<number | void> {
        return await postRepository.save(postDto);
    }

    async updatePost(postId: number, postForm: PostForm) {
        const post = await postRepository.getById(postId);

        if (!post) {
            return Promise.reject();
        }

        post.id = postId;
        post.title = postForm.title;
        post.content = postForm.content

        await postRepository.update(post);
    }

    async deletePost(id: number) {
        await postRepository.deleteById(id);
    }

    async getPostDetail(postId: number): Promise<PostDetail> {
        const post = await postRepository.getById(postId);
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
            const post = await postRepository.getById(id);
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
            await postRepository.update(post);

            await t.commit();
        });
    }
}