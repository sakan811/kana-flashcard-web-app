const request = require('supertest');
const app = require('../server');

describe('POST /hiragana-answer', () => {
  it('should create a new hiragana answer and return it', async () => {
    const response = await request(app)
      .post('/hiragana-answer')
      .send({
        answer: 'mockAnswer',
        hiragana: 'か',
        romanji: 'ka',
        is_correct: true,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('answer', 'mockAnswer');
    expect(response.body).toHaveProperty('hiragana', 'か');
    expect(response.body).toHaveProperty('romanji', 'ka');
    expect(response.body).toHaveProperty('is_correct', true);
  });
});
