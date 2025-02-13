import request from 'supertest';
import { App } from 'supertest/types';
import { upSeedDB, downSeedDB, existingUserEmail, newUserEmail } from './seed';
import { Auth } from '../../../../src/types/api';
import { getTestApp } from '../../../testServer';

let app: App;

beforeAll(async () => {
  app = await getTestApp();
});

const validUser: Auth['RegisterReqBody'] = {
  name: 'John Doe',
  email: newUserEmail,
  password: 'Password1234',
  role: 'attendee',
};

describe('POST /auth/register', () => {
  beforeEach(async () => {
    await upSeedDB();
  });

  afterEach(async () => {
    await downSeedDB();
  });

  describe('Success', () => {
    test('Registers a new user successfully', async () => {
      const { status, body } = await request(app).post('/auth/register').send(validUser);

      expect(status).toEqual(201);
      expect(body.user.userId).toBeDefined();
      expect(body.user.name).toEqual(validUser.name);
      expect(body.user.email).toEqual(validUser.email);
      expect(body.user.role).toEqual(validUser.role);
      expect(body.token).toBeDefined();
    });
  });

  describe('Failures', () => {
    test('Fails if email is already taken', async () => {
      const existingEmailUser = {
        ...validUser,
        email: existingUserEmail,
      };
      const { status, body } = await request(app).post('/auth/register').send(existingEmailUser);

      expect(status).toEqual(409);
      expect(body.message).toEqual('Email already in use');
    });

    test('Fails if password is too short', async () => {
      const invalidUser = { ...validUser, password: 'short' };
      const { status, body } = await request(app).post('/auth/register').send(invalidUser);

      expect(status).toEqual(400);
      expect(body.error).toEqual('Validation failed');
    });

    test('Fails if email format is invalid', async () => {
      const invalidUser = { ...validUser, email: 'invalid-email' };
      const { status, body } = await request(app).post('/auth/register').send(invalidUser);

      expect(status).toEqual(400);
      expect(body.error).toEqual('Validation failed');
    });

    test('Fails if required fields are missing', async () => {
      const invalidUser = { name: 'John Doe' };
      const { status, body } = await request(app).post('/auth/register').send(invalidUser);

      expect(status).toEqual(400);
      expect(body.error).toEqual('Validation failed');
    });
  });
});
