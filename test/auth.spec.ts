import * as chai from 'chai';
const chaiHttp = require('chai-http');
import 'mocha';

chai.use(chaiHttp);
const expect = chai.expect;

describe('post API Request', () => {
    it('should return response on call', () => {
        return chai.request('http://localhost:3000').get('/post')
            .then(res => {
                chai.expect(res.text).to.eql("how's it going?");
            })
    })
})
