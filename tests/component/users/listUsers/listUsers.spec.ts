import request from 'supertest';
import { App } from 'supertest/types';
import { upSeedDB, downSeedDB, hostId, attendeeId } from './seed';
import { AuthService } from '../../../../src/services/auth';
import { getTestApp } from '../../../testServer';
import { User } from '../../../../src/models';
import { Users } from '../../../../src/types/api';

let app: App;

const auth = new AuthService();
const hostToken = auth.generateToken(hostId, 'host');
const attendeeToken = auth.generateToken(attendeeId, 'attendee');

beforeAll(async () => {
  app = await getTestApp();
});

describe('GET /users', () => {
  beforeEach(async () => {
    await upSeedDB();
  });

  afterEach(async () => {
    await downSeedDB();
  });

  describe('Success', () => {
    test('List users as a host only returns host details', async () => {
      const { status, body } = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${hostToken}`);

      expect(status).toEqual(200);
      expect(body.length).toEqual(1);

      const users: Users['ListResBody'] = body;

      users.forEach(user => {
        expect(user).not.toHaveProperty('password');
        expect(user.role).toEqual('host');
        expect(user.userId).toEqual(hostId);
      });
    });

    test('List users as an attendee only returns attendee details', async () => {
      const { status, body } = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${attendeeToken}`);

      expect(status).toEqual(200);
      expect(body.length).toEqual(1);

      const users: Users['ListResBody'] = body;

      users.forEach(user => {
        expect(user).not.toHaveProperty('password');
        expect(user.role).toEqual('attendee');
        expect(user.userId).toEqual(attendeeId);
      });
    });
  });
});
