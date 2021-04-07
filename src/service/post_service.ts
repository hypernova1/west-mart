import PostRepository from '../repository/post_repository';
import Post from '../models/post';
import { PostDto, PostListRequest, PostForm, PostDetail } from '../payload/post_dto';

const postRepository = new PostRepository();

export default class PostService {

    async getPostList(request: PostListRequest)  {
        const postList = await postRepository.getListByTitleLikeOrContentLike(request.pageNo, request.size, request.keyword);
        const totalCount = await postRepository.countByTitleLikeOrContentLike(request.keyword);
        const postDtoList = postList.map((post: Post) => {
            return {
                id: post.id,
                title: post.title,
                content: post.content,
                writer: post.writer.nickname,
                regDate: post.createdAt
            } as PostDto
        });

        const isExistNextPage = totalCount / request.size > request.pageNo;

        return {
            postList: postDtoList,
            isExistNextPage: isExistNextPage,
        }
    }

    registerPost(postDto: PostForm): Promise<number | void> {
        return postRepository.save(postDto);
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
}