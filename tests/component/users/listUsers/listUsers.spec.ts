import request from 'supertest';
import { upSeedDB, downSeedDB, hostId, attendeeId } from './seed';
import { AuthService } from '../../../../src/services/auth';
import { getTestApp } from '../../../testServer';
import { User } from '../../../../src/models';

let app: any;

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
      const response = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${hostToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toEqual(1);

      const users: User[] = response.body;

      users.forEach(user => {
        expect(user.password).toBeUndefined();
        expect(user.role).toEqual('host');
        expect(user.id).toEqual(hostId);
      });
    });

    test('List users as an attendee only returns attendee details', async () => {
      const response = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${attendeeToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toEqual(1);

      const users: User[] = response.body;

      users.forEach(user => {
        expect(user.password).toBeUndefined();
        expect(user.role).toEqual('attendee');
        expect(user.id).toEqual(attendeeId);
      });
    });
  });
});
