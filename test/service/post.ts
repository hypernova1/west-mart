import 'tsconfig-paths/register';
import 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import PostService from '../../src/service/post_service';
import { PostDetail, PostListDto, PostListRequest } from '../../src/payload/post';
import PostRepository from '../../src/repository/post_repository';
import FavoritePostRepository from '../../src/repository/favorite_post_repository';
import CategoryRepository from '../../src/repository/category_repository';
import TagService from '../../src/service/tag_service';
import TagRepository from '../../src/repository/tag_repository';
import NotFoundError from '../../src/error/not_found_error';
import Post from '../../src/model/post';

const expect = chai.expect;

describe('test getPostDetail', () => {
    const postRepository = new PostRepository();
    const favoritePostRepository = new FavoritePostRepository();
    const categoryRepository = new CategoryRepository();
    const tagService = new TagService(new TagRepository());

    const postService = new PostService(postRepository, favoritePostRepository, categoryRepository, tagService);

});

describe('test', () => {
    const postRepository = new PostRepository();
    const favoritePostRepository = new FavoritePostRepository();
    const categoryRepository = new CategoryRepository();
    const tagService = new TagService(new TagRepository());

    const postService = new PostService(postRepository, favoritePostRepository, categoryRepository, tagService);
    const findById = sinon.spy(PostRepository.prototype, 'findById');

    it('test', () => {
        postService.getPostDetail(1);
        sinon.assert.calledWith(findById, 1);
        expect(findById.callCount).to.be.eq(1);
    })
})