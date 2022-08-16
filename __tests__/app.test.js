const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
// const UserService = require('../lib/services/userService');

const mockUser = {
  username: 'testUser',
  email: 'admin',
  password: 'admin',
};

const mockUser2 = {
  username: 'testUser2',
  email: 'example1@example.com',
  password: '234567',
};

const mockUser3 = {
  username: 'testUser3',
  email: 'example3@example.com',
  password: '345678',
};

const agent = request.agent(app);

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('#post creates a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      username: 'testUser',
      email: 'admin',
    });
  });
  it('#post created users must have unique emails', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser2);

    expect(res.body).toEqual({
      status: 500,
      message:
        'duplicate key value violates unique constraint "users_email_key"',
    });
  });
  it('#post /sessions logs in an existing user', async () => {
    await request(app).post('/api/v1/users').send(mockUser);
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: 'admin', password: 'admin' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'sign in successful',
    });
  });
  it('#post /sessions errors if pw and email do not match', async () => {
    await request(app).post('/api/v1/users').send(mockUser);
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: 'admin', password: '345678' });

    expect(res.body).toEqual({
      status: 401,
      message: 'Invalid password',
    });
  });
  it('#get /restaurants shows a list of restaurants', async () => {
    const res = await request(app).get('/api/v1/restaurants');
    expect(res.status).toBe(200);
    expect(res.body.length).toEqual(3);
  });
  afterAll(() => {
    pool.end();
  });
  it('#get /restaurants/:restId shows a restaurant with reviews', async () => {
    const res = await request(app).get('/api/v1/restaurants/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      name: 'Mama Magliones',
      reviews: ['Its not just a frozen lasagne, its a Mama Maglione!'],
    });
  });
  it('#get /users rejects non authorized user', async () => {
    await agent.post('/api/v1/users').send(mockUser3);
    const { email, password } = mockUser3;
    await agent.post('/api/v1/users/sessions').send({ email, password });

    const res = await agent.get('/api/v1/users');

    expect(res.body).toEqual({
      status: 403,
      message: 'You do not have access to view this page',
    });
  });
  it('#get /users shows a list of users to an admin', async () => {
    await agent.post('/api/v1/users').send(mockUser);
    const { email, password } = mockUser;
    await agent.post('/api/v1/users/sessions').send({ email, password });

    const res = await agent.get('/api/v1/users');

    expect(res.status).toBe(200);
    expect(res.body.length).toEqual(3);
  });
  it('#post /restId/reviews creates a new review', async () => {
    const user = await agent.post('/api/v1/users').send(mockUser);
    const { email, password } = mockUser;
    const success = await agent
      .post('/api/v1/users/sessions')
      .send({ email, password });

    const res = await agent.post('/api/v1/restaurants/2/reviews').send({
      user_id: user.body.id,
      restaurant_id: 2,
      reviews: 'Great place, but only for a real New Yorker',
    });

    console.log('test ----->', res.body);
    expect(res.status).toBe(200);
  });
});
