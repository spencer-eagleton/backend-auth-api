const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('backend-auth-api routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('creates a new user', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send({ username: 'max', password: 'ballislife' });

    expect(res.body).toEqual({ id: expect.any(String), username: 'max' });
  });
});
