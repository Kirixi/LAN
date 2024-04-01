import request from 'supertest';
import createServer from '../server.ts';

const app = createServer();

describe('User Routes', () => {
    it('should create a new user', async () => {
        const res = await request(app)
            .post('/create')
            .send({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.username).toEqual('testuser');
    });

    // Add more tests for other routes and scenarios
});