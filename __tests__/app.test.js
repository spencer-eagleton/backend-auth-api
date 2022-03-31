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
      .post('/api/v1/users/session')
      .send({ username: 'max', password: 'ballislife' });
    expect(res.body).toEqual({
      message: 'you have been logged in',
      user,
    });
  });

  it('deletes a user session', async () => {
    const agent = request.agent(app);

    await UserService.create({
      username: 'max',
      password: 'ballislife',
    });

    await agent
      .post('/api/v1/users/session')
      .send({ username: 'max', password: 'ballislife' });

    const res = await agent.delete('/api/v1/users/session');

    expect(res.body).toEqual({ message: 'you have been logged out' });
  });

  it('allows the current user to view list of secrets', async () => {
    const agent = request.agent(app);

    await UserService.create({
      username: 'Spencer',
      password: 'ilovelamp',
    });

    let res = await agent.get('/api/v1/secrets');
    expect(res.status).toEqual(401);

    await agent
      .post('/api/v1/users/session')
      .send({ username: 'Spencer', password: 'ilovelamp' });

    res = await agent.get('/api/v1/secrets');
    expect(res.status).toEqual(200);
  });

  it('should allow a logged in user to create a secret', async () => {
    const agent = request.agent(app);

    await UserService.create({
      username: 'Spencer',
      password: 'ilovelamp',
    });

    let res = await agent
      .post('/api/v1/users/session')
      .send({ username: 'Spencer', password: 'ilovelamp' });

    res = await agent.post('/api/v1/secrets').send({
      userId: '1',
      title: 'Spencers big secret',
      description: 'I looove lamp',
      createdAt: expect.any(String)
    });

    expect(res.body).toEqual({
      id: expect.any(String),
      title: 'Spencers big secret',
      description: 'I looove lamp',
      createdAt: expect.any(String),
      userId: '1',
    });
  });
});
