import 'mocha';
import 'tsconfig-paths/register';
import chaiHttp = require('chai-http');
import * as chai from 'chai';
import { getToken } from "../util/auth";
import CommentService from '../../src/service/comment_service';
import '../../src/model';

chai.use(chaiHttp);

const expect = chai.expect;

describe('comment method test', () => {
    const commentService = new CommentService();
    it('should ', async () => {
        const result = await commentService.getCommentList(1);
        expect(result.commentList).to.be.instanceof(Array);
    });
});