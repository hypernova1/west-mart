import 'module-alias/register';
import 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as sinon from 'sinon';
import Application from '../../src/application';

chai.use(chaiHttp);

const expect = chai.expect;

const app = new Application();
app.setRouter();
app.setSequelize();
app.setMiddleware();

describe('router test', () => {
    it('login test', () => {
        return chai.request(app.application)
            .post('/auth/login')
            .set('content-type', 'application/json')
            .send({
                email: 'test title',
                password: 'test desc',
            })
            .then((res) => {
                console.log(res);
                return expect(res.status).to.eq(422);
            })
    })

})