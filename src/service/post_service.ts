import PostRepository from '../repository/post_repository';
import Post from '../models/post';
import {PostDto, PostListRequest, PostForm} from '../dto/post_dto';

const postRepository = new PostRepository();

export default class PostService {

    async getPostList(request: PostListRequest)  {
        const page = await postRepository.getList(request.pageNo, request.size, request.keyword);
        const postDtoList = page.rows.map((post: Post) => {
            return {
                id: post.id,
                title: post.title,
                content: post.content,
                writer: post.writer.nickname,
                regDate: post.createdAt
            } as PostDto
        });

        return {
            postList: postDtoList,
            count: page.count,
        }
    }

    register(postDto: PostForm): Promise<number | void> {
        return postRepository.save(postDto);
    }

    async updatePost(postId: number, postDto: PostForm) {
        await postRepository.update(postId, postDto);
    }
}