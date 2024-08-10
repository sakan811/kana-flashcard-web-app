const request = require('supertest');
const app = require('../server');

describe('POST /katakana-answer', () => {
  it('should create a new katakana answer and return it', async () => {
    const response = await request(app)
      .post('/katakana-answer')
      .send({
        answer: 'mockAnswer',
        katakana: 'カ',
        romanji: 'ka',
        is_correct: true,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('answer', 'mockAnswer');
    expect(response.body).toHaveProperty('katakana', 'カ');
    expect(response.body).toHaveProperty('romanji', 'ka');
    expect(response.body).toHaveProperty('is_correct', true);
  });
});
