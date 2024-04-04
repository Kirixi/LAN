import request from 'supertest';
import createServer from '../server.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

const app = createServer();
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri())

})

afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
    await mongoServer.stop();
})

const comment = {
    email: 'something@gmail.com',
    content: 'This is a comment',
    link: 'www.google.com',
    createdAt: '2021-03-24',
    parentId: '1'
}

describe('Post Routes', () => {
    it('Should create a new comment on post', async () => {


        const res = await request(app)
            .post('/api/comment/create')
            .send(comment);

        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toHaveProperty('_id');
        expect(res.body.data.link).toEqual('www.google.com');

    })


    it('Should get comments made by the user', async () => {

        const res = await request(app).get(`/api/comment/getUserComments/${comment.email}`)

        expect(res.statusCode).toEqual(200);
        expect(res.body.data[0].userEmail).toEqual(comment.email);
    })
});