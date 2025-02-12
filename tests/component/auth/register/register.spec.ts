import axios from 'axios';
import { upSeedDB, downSeedDB, existingUserEmail, newUserEmail } from './seed';
import { Auth } from '../../../../src/types/api';

const BASE_URL = 'http://localhost:3001/auth/register';

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
      const { status, data } = await axios.post(BASE_URL, validUser);

      expect(status).toBe(201);
      expect(data.user.id).toBeDefined();
      expect(data.user.name).toBe(validUser.name);
      expect(data.user.email).toBe(validUser.email);
      expect(data.user.role).toBe(validUser.role);
      expect(data.token).toBeDefined();
    });
  });

  describe('Failures', () => {
    test('Fails if email is already taken', async () => {
      const existingEmailUser = {
        ...validUser,
        email: existingUserEmail,
      };
      const { status, data } = await axios.post(BASE_URL, existingEmailUser, { validateStatus: () => true });

      expect(status).toBe(409);
      expect(data.message).toBe('Email already in use');
    });

    test('Fails if password is too short', async () => {
      const invalidUser = { ...validUser, password: 'short' };
      const { status, data } = await axios.post(BASE_URL, invalidUser, { validateStatus: () => true });

      expect(status).toBe(400);
      expect(data.error).toBe('Validation failed');
    });

    test('Fails if email format is invalid', async () => {
      const invalidUser = { ...validUser, email: 'invalid-email' };
      const { status, data } = await axios.post(BASE_URL, invalidUser, { validateStatus: () => true });

      expect(status).toBe(400);
      expect(data.error).toBe('Validation failed');
    });

    test('Fails if required fields are missing', async () => {
      const invalidUser = { name: 'John Doe' };
      const { status, data } = await axios.post(BASE_URL, invalidUser, { validateStatus: () => true });

      expect(status).toBe(400);
      expect(data.error).toBe('Validation failed');
    });
  });
});
