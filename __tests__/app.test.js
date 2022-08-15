const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const mockUser = {
  username: 'testUser',
  email: 'test@example.com',
  password: '123456',
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
  it('#post creates a new user', () => {
    //
  });
  afterAll(() => {
    pool.end();
  });
});
