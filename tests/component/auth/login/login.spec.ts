import request from 'supertest';
import { App } from 'supertest/types';
import jwt from 'jsonwebtoken';
import { upSeedDB, downSeedDB, password, hostId } from './seed';
import { Auth } from '../../../../src/types/api';
import { getTestApp } from '../../../testServer';

let app: App;

beforeAll(async () => {
  app = await getTestApp();
});

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
      const { status, body } = await request(app).post('/auth/login').send(reqBody);

      expect(status).toEqual(200);
      expect(body.token).toBeDefined();

      const jwtPayload = jwt.decode(body.token);

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

      const invalidEmailBody: Auth['LoginReqBody'] = {
        email: 'ed@ed.com',
        password: 'akwdkjahwd',
      };

      const { status, body } = await request(app).post('/auth/login').send(invalidEmailBody);

      expect(status).toEqual(404);
      expect(body.message).toEqual(`No user found matching email '${invalidEmailBody.email}'`);
    });

    test('Cannot sign in with incorrect password', async () => {
      const incorrectPasswordBody: Auth['LoginReqBody'] = {
        email: 'ed@example.com',
        password: 'Password12345',
      };

      const { status, body } = await request(app).post('/auth/login').send(incorrectPasswordBody);

      expect(status).toEqual(401);
      expect(body.message).toEqual('Invalid email or password');
    });
  });
});
