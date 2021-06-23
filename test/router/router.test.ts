import 'module-alias/register';
import 'mocha';
import chai from 'chai';
import chaiHttp = require('chai-http');
import * as sinon from 'sinon';
import app from '../../src/application';
import {describe} from 'mocha';

chai.use(chaiHttp);

const expect = chai.expect;

describe('test', () => {
    return chai.request(app)
        .post('/auth')
        .field({
            email: 'test title',
            password: 'test desc',
        })
        .then((res) => {
            return expect(res.status).to.eq(200);
        });
})