import PostRepository from '../repository/post_repository';
import UserRepository from '../repository/user_repository';
import Post from '../models/post';
import { PostDto, PostListRequest, PostForm, PostDetail } from '../payload/post_dto';

const postRepository = new PostRepository();
const userRepository = new UserRepository();

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

    async updatePost(postId: number, postDto: PostForm) {
        await postRepository.update(postId, postDto);
    }

    async deletePost(id: number) {
        await postRepository.deleteById(id);
    }

    async getPostDetail(postId: number): Promise<PostDetail> {
        const post = await postRepository.getById(postId);

        return {
            id: post.id,
            title: post.title,
            content: post.content,
            writerId: post.writer.id,
            writerName: post.writer.nickname,
        } as PostDetail;
    }

    async toggleFavorite(id: number, userId: number) {
        const post = await postRepository.getById(id);
        const user = await userRepository.findById(id);
        const isExist: boolean = post.favorites.some((favorite) => favorite.id === userId);
        if (isExist) {
            const existUserIndex = post.favorites.indexOf(user);
            post.favorites.splice(existUserIndex, 1);
            post.favorite--;
        } else {
            post.favorites.push(user);
            post.favorite++;

        }
        await userRepository.update(user);
    }
}