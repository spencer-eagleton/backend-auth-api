const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

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

  it('start a new user session', async () => {
    const user = await UserService.create({
      username: 'max',
      password: 'ballislife',
    });
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ username: 'max', password: 'ballislife' });

    expect(res.body).toEqual({
      message: 'you have been logged in',
      user,
    });
  });


});
