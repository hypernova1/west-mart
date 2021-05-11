import 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { getToken } from "../util/auth";

chai.use(chaiHttp);

const expect = chai.expect;

describe('post API Request', () => {
    let token: string;
    before(async () => {
        token = await getToken();
    })
    it('should return response on call', () => {
        return chai.request('http://localhost:3000')
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