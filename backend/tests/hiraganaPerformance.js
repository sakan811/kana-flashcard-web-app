const request = require('supertest');
const app = require('../server');

describe('GET /hiragana-performance', () => {
  it('should return with 200 status', async () => {
    const response = await request(app).get('/hiragana-performance');

    expect(response.statusCode).toBe(200);
  });
});
