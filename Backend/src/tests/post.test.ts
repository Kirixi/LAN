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

describe('Post Routes', () => {
    it('Should create a new post', async () => {

        const res = await request(app)
            .post('/api/post/create')
            .send({
                content: "loser dwafwafad asdasd awd",
                link: "1231455daw",
                parent_id: "2",
                createdAt: "2022-08-23T16:50:22-07:00",
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.link).toEqual('1231455daw');
    });

    it('Should get all the post made by user', async () => {
        const res = await request(app).get('/api/post/userposts/2')

        expect(res.statusCode).toEqual(200);
        expect(res.body.data[0]).toHaveProperty('createdAt');
        expect(res.body.data[0].parent_id).toEqual("2");

    })

});