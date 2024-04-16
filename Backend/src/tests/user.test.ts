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


const newUser = {
    email: "test@gmail.com",
    password: "pow123",
    username: "test"
}

const loginDetails = {
    email: "test@gmail.com",
    password: "pow123",
}
describe('User Routes', () => {

    it('Creates a new user', async () => {
        const res = await request(app).post('/api/user/create').send(newUser);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id');
    })

    it('Gets user info with email', async () => {
        const res = await request(app).get(`/api/user/getUsername/${newUser.email}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.username).toEqual(newUser.username);
    })

    it('Logs in user successfully', async () => {
        const res = await request(app).get('/api/user/login').send(loginDetails);

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Welcome!');
        expect(res.body.data.email).toEqual(newUser.email);
    })
})