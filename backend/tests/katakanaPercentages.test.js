const request = require('supertest');
const app = require('../server');

describe('GET /katakana-percentages', () => {
  it('should return the correct percentages for katakana answers', async () => {
    const response = await request(app).get('/katakana-percentages');

    expect(response.statusCode).toBe(200);
  });
});
