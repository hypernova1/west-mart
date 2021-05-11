import 'mocha';
import 'tsconfig-paths/register';
import chaiHttp = require('chai-http');
import * as chai from 'chai';
import { getToken } from "../util/auth";
import CommentService from '../../src/service/comment_service';
import '../../src/model';
import * as sinon from 'sinon';
import {CommentResponse} from '../../src/payload/comment';

chai.use(chaiHttp);

const expect = chai.expect;

describe('comment method test', () => {
    const commentService = sinon.createStubInstance(CommentService);

    before(() => {
        commentService.getCommentList.resolves({
            commentList: [],
            totalCount: 0,
        } as CommentResponse)
    })

    it('should ', async () => {
        const result = await commentService.getCommentList(1);
        expect(result.commentList).to.be.instanceof(Array);
    });
});