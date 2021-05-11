import 'tsconfig-paths/register';
import 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import PostService from '../../src/service/post_service';
import { PostDetail, PostListDto, PostListRequest } from '../../src/payload/post';

const expect = chai.expect;

describe('postService method test', () => {
    const postService = sinon.createStubInstance(PostService);

    before(() => {
        postService.getPostDetail.resolves({
            id: 1,
            writerName: 'sam',
            tags: [],
            title: 'test',
            content: 'test',
            writerId: 1,
        } as PostDetail);

        postService.getPostList.resolves({
            postList: [],
            isExistNextPage: false,
        } as PostListDto);
    })

    it('test getPostDetail ', async () => {
        const post = await postService.getPostDetail(1);
        expect(post.writerName).to.eq('sam');
    });

    it('test getPostList', async () => {
        const postRequest = {
            pageNo: 1,
            size: 10,
            keyword: ''
        } as PostListRequest;

        const result = await postService.getPostList(postRequest);
        expect(result.postList).to.be.instanceof(Array);
    });
});
