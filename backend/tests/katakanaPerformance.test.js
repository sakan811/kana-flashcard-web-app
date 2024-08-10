const request = require('supertest');
const app = require('../server');

describe('GET /katakana-performance', () => {
  it('should return with 200 status', async () => {
    const response = await request(app).get('/katakana-performance');

    expect(response.statusCode).toBe(200);
  });
});
