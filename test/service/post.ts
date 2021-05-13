import 'tsconfig-paths/register';
import 'mocha';
import * as chai from 'chai';
import chaiAsPromised = require('chai-as-promised');
import * as sinon from 'sinon';
import PostService from '../../src/service/post_service';
import PostRepository from '../../src/repository/post_repository';
import FavoritePostRepository from '../../src/repository/favorite_post_repository';
import CategoryRepository from '../../src/repository/category_repository';
import TagService from '../../src/service/tag_service';
import TagRepository from '../../src/repository/tag_repository';
import NotFoundError from '../../src/error/not_found_error';
import Post from '../../src/model/post';
import User from '../../src/model/user';

chai.use(chaiAsPromised);

const expect = chai.expect;

describe('test getPostDetail', () => {
    const sandbox = sinon.createSandbox();
    const stubPostRepository = sinon.createStubInstance(PostRepository);

    const favoritePostRepository = new FavoritePostRepository();
    const categoryRepository = new CategoryRepository();
    const tagService = new TagService(new TagRepository());

    const postService = new PostService(stubPostRepository, favoritePostRepository, categoryRepository, tagService);

    afterEach(() => {
        sandbox.restore();
    });

    it('found post', async () => {
        stubPostRepository.findById.returns(Promise.resolve({
            id: 1,
            title: 'title',
            content: 'content',
            tags: [],
            writer: {
                id: 1,
                nickname: 'sam',
            } as User
        } as Post));
        const post = await postService.getPostDetail(1);
        console.log(post);
        await expect(post).to.be.ok;
    });

    it('not found post', async () => {
        stubPostRepository.findById.returns(Promise.resolve(null));

        await expect(postService.getPostDetail(1)).to.rejectedWith(NotFoundError);
    });
});

describe('test', () => {
    const postRepository = new PostRepository();
    const favoritePostRepository = new FavoritePostRepository();
    const categoryRepository = new CategoryRepository();
    const tagService = new TagService(new TagRepository());

    const postService = new PostService(postRepository, favoritePostRepository, categoryRepository, tagService);

    const findById = sinon.spy(postRepository, 'findById');

    it('test', () => {
        postService.getPostDetail(1);
        sinon.assert.calledWith(findById, 1);
        expect(findById.callCount).to.be.eq(1);
    });
});