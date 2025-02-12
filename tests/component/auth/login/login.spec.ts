import axios from 'axios';
import jwt from 'jsonwebtoken';

import { upSeedDB, downSeedDB, password, hostId } from './seed';
import { Auth } from '../../../../src/types/api';

const BASE_URL = 'http://localhost:3001/auth/login';

const reqBody: Auth['LoginReqBody'] = {
  email: 'ed@example.com',
  password,
};

describe('POST /auth/login', () => {

  beforeEach(async () => {
    await upSeedDB();
  });

  afterEach(async () => {
    await downSeedDB();
  });

  describe('Success', () => {
    test('Password matches, returns access token and JWT contains user info', async () => {
      const { status, data } = await axios.post(BASE_URL, reqBody, { validateStatus: () => true });

      expect(status).toEqual(200);
      expect(data.token).toBeDefined();

      const jwtPayload = jwt.decode(data.token);

      if (jwtPayload && typeof jwtPayload === 'object') {
        expect(jwtPayload.exp).toBeDefined();
        expect(jwtPayload.iat).toBeDefined();
        expect(jwtPayload.userId).toEqual(hostId);
        expect(jwtPayload.role).toEqual('host');
      } else {
        throw new Error('Invalid JWT payload');
      }
    });
  });

  describe('Failures', () => {
    test('Cannot sign in if email does not exist', async () => {

      const body: Auth['LoginReqBody'] = {
        email: 'ed@ed.com',
        password: 'akwdkjahwd',
      };

      const { status, data } = await axios.post(BASE_URL, body, { validateStatus: () => true });

      expect(status).toEqual(404);
      expect(data.message).toEqual(`No user found matching email '${body.email}'`);
    });

    test('Cannot create a user with an invalid body', async () => {

      const body: Auth['LoginReqBody'] = {
        email: 'ed@example.com',
        password: 'Password12345', // incorrect password
      };

      const { status, data } = await axios.post(BASE_URL, body, { validateStatus: () => true });

      expect(status).toEqual(401);
      expect(data.message).toEqual('Invalid email or password');
    });
  });
});
