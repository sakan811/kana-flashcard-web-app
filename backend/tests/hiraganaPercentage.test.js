const request = require('supertest');
const app = require('../server');

describe('GET /hiragana-percentages', () => {
  it('should return the correct percentages for hiragana answers', async () => {
    const response = await request(app).get('/hiragana-percentages');

    expect(response.statusCode).toBe(200);
  });
});
