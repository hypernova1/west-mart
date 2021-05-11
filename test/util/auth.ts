import chaiHttp = require('chai-http');
import * as chai from 'chai';

chai.use(chaiHttp);

export async function getToken(): Promise<string> {
    return chai.request('http://localhost:3000')
        .post('/auth/login')
        .send({
            email: 'hypemova@gmail.com',
            password: '0000',
        }).then((res) => {
            return res.body.token;
        });
}