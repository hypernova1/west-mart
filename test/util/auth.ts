import chaiHttp = require('chai-http');
import * as chai from 'chai';

chai.use(chaiHttp);

export async function getToken(): Promise<string> {
    return chai.request('http://172.31.190.5:3000')
        .post('/auth/login')
        .send({
            email: 'hypemova@gmail.com',
            password: '1111',
        }).then((res) => {
            return res.body.token;
        });
}