import axios from 'axios';
import { upSeedDB, downSeedDB } from './seed';
import { Users } from '../../../../src/types/api';
import { error } from 'console';

const BASE_URL = 'http://localhost:3001/users';

const reqBody: Users['PostReqBody'] = {
  name: 'Ed Thomas',
  email: 'ed@ed.com',
  role: 'attendee',
};

describe('POST /users', () => {

  beforeEach(async () => {
    await upSeedDB();
  });

  afterEach(async () => {
    await downSeedDB();
  });

  describe('Success', () => {
    test('Creates attendee user', async () => {
      try {
        const { status, data } = await axios.post(BASE_URL, reqBody);

        expect(status).toBe(201);
        expect(data.name).toEqual(reqBody.name);
        expect(data.email).toEqual(reqBody.email);
        expect(data.role).toEqual(reqBody.role);
      } catch (error) {
        console.log("ERROR >>>>>>>>", error);
        throw error;
      }
    });

    test('Creates host user', async () => {

      const body: Users['PostReqBody'] = {
        ...reqBody,
        role: 'host',
      };

      const { status, data } = await axios.post(BASE_URL, body);

      expect(status).toBe(201);
      expect(data.name).toEqual(body.name);
      expect(data.email).toEqual(body.email);
      expect(data.role).toEqual(body.role);
    });
  });

  describe('Failures', () => {
    test('Cannot create a user with an existing email', async () => {

      const body: Users['PostReqBody'] = {
        ...reqBody,
        email: 'ed@example.com',
      };

      const { status, data } = await axios.post(BASE_URL, body, { validateStatus: () => true });

      expect(status).toBe(409);
      expect(data.message).toEqual('Email already in use');
    });
  });
});
