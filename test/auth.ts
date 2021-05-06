import 'mocha';
import chaiHttp = require('chai-http');
import * as chai from 'chai';

chai.use(chaiHttp);
const expect = chai.expect;

describe('post API Request', () => {
    it('should return response on call', () => {
        return chai.request('http://localhost:3000')
            .get('/post')
            .then((res) => {
                expect(res.status).to.eq(401);
            })
    })
})
