import 'tsconfig-paths/register';
import 'mocha';
import * as chai from 'chai';
import chaiAsPromised = require('chai-as-promised');
import * as sinon from 'sinon';

import PostService from '../../src/service/post_service';
import TagService from '../../src/service/tag_service';
import NotFoundError from '../../src/error/not_found_error';
import Post from '../../src/model/post';
import User from '../../src/model/user';

chai.use(chaiAsPromised);

const expect = chai.expect;

describe('test', () => {

    it('test', () => {
        console.log('test');
    });

});

