const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/userService');

const mockUser = {
  username: 'testUser',
  email: 'test@example.com',
  password: '123456',
};

const mockUser2 = {
  username: 'testUser2',
  email: 'example1@example.com',
  password: '234567',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;

  //create agent to track cookies through a single session
  const agent = request.agent(app);

  //create user to log in with
  const user = await UserService.create({ ...mockUser, ...userProps });

  //sign in
  const { email } = user;
  await agent.post('/api/v1/users').send({ email, password });
  return [agent, user];
};

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
      email: 'test@example.com',
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
      .send({ email: 'test@example.com', password: '123456' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'sign in successful',
    });
  });
  it('#post /sessions errors if pw and email do not match', async () => {
    await request(app).post('/api/v1/users').send(mockUser);
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: 'test@example.com', password: '345678' });

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
  it('#get /restaurants/:restId shows a list of restaurants with reviews', async () => {
    const res = await request(app).get('/api/v1/restaurants/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      name: 'Mama Magliones',
      reviews: ['Its not just a frozen lasagne, its a Mama Maglione!'],
    });
  });
});
