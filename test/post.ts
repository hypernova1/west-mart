import 'mocha';
import 'tsconfig-paths/register';
import chaiHttp = require('chai-http');
import * as chai from 'chai';
import { getToken } from "./util/auth";
import PostService from '../src/service/post_service';
import { PostListRequest, PostSummary } from '../src/payload/post';

chai.use(chaiHttp);
const expect = chai.expect;

describe('post API Request', () => {
    let token: string;
    before(async () => {
        token = await getToken();
    })
    it('should return response on call', () => {
        return chai.request('http://172.31.190.5:3000')
            .get('/post')
            .set({
                'Authorization': `Bearer ${token}`,
            })
            .then((res) => {
                console.log(res.body)
                expect(res.status).to.eq(200);
            })
    });
});

describe('postService method test', () => {
    const postService = new PostService();

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
