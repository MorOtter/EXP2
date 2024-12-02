const app = require("../server");
const request = require('supertest');

// test server
describe('Server', () => {
    it('should start the server without errors', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    }); 
});

describe('Get /', () => {
    it('should return 200 OK', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    })
})