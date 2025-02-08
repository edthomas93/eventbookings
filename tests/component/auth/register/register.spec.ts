import axios from 'axios';
import { upSeedDB, downSeedDB } from './seed';
import { Auth } from '../../../../src/types/api';

const BASE_URL = 'http://localhost:3001/auth/register';

const reqBody: Auth['RegisterReqBody'] = {
  name: 'Ed Thomas',
  email: 'ed@ed.com',
  role: 'attendee',
  password: 'Password1234',
};

describe('POST /auth/register', () => {

  beforeEach(async () => {
    await upSeedDB();
  });

  afterEach(async () => {
    await downSeedDB();
  });

  describe('Success', () => {
    test('Creates and returns attendee user and access token', async () => {
      const { status, data } = await axios.post(BASE_URL, reqBody);

      expect(status).toBe(201);
      expect(data.user.name).toEqual(reqBody.name);
      expect(data.user.email).toEqual(reqBody.email);
      expect(data.user.role).toEqual(reqBody.role);
      expect(data.user.password).not.toBeDefined();
      expect(data.token).toBeDefined();
    });

    test('Creates and returns host user and token', async () => {

      const body: Auth['RegisterReqBody'] = {
        ...reqBody,
        role: 'host',
      };

      const { status, data } = await axios.post(BASE_URL, body);

      expect(status).toBe(201);
      expect(data.user.name).toEqual(body.name);
      expect(data.user.email).toEqual(body.email);
      expect(data.user.role).toEqual(body.role);
      expect(data.user.password).not.toBeDefined();
      expect(data.token).toBeDefined();
    });
  });

  describe('Failures', () => {
    test('Cannot create a user with an existing email', async () => {

      const body: Auth['RegisterReqBody'] = {
        ...reqBody,
        email: 'ed@example.com',
      };

      const { status, data } = await axios.post(BASE_URL, body, { validateStatus: () => true });

      console.log("DATA >>>>>>>>", data);

      expect(status).toEqual(409);
      expect(data.message).toEqual('Email already in use');
    });

    test('Cannot create a user with an invalid body', async () => {

      const body = {
        email: 'ed@example.com',
      };

      const { status, data } = await axios.post(BASE_URL, body, { validateStatus: () => true });

      expect(status).toEqual(400);
      expect(data.details).toEqual([
        { message: "should have required property 'name'" },
        { message: "should have required property 'password'" },
        { message: "should have required property 'role'" },
      ]);
      expect(data.error).toEqual('Validation failed');
    });
  });
});
