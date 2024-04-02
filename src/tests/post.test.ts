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
                parent_id: "2"
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.link).toEqual('1231455daw');
    });

});