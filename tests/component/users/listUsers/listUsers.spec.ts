import axios from 'axios';
import { upSeedDB, downSeedDB, hostId, attendeeId } from './seed';
import { User } from '../../../../src/models/users';
import { AuthService } from '../../../../src/services/auth';

const BASE_URL = 'http://localhost:3001/users';

const auth = new AuthService();

const hostToken = auth.generateToken(hostId, 'host');
const attendeeToken = auth.generateToken(attendeeId, 'attendee');

describe('GET /users', () => {

  beforeEach(async () => {
    await upSeedDB();
  });

  afterEach(async () => {
    await downSeedDB();
  });

  describe('Success', () => {
    test('List users as a host only returns host details', async () => {
      const { status, data } = await axios.get<User[]>(BASE_URL, {
        headers: { Authorization: `Bearer ${hostToken}` }
      });
      expect(status).toBe(200);
      expect(data.length).toEqual(1);

      data.forEach(user => {
        expect(user.password).toBeUndefined()
        expect(user.role).toEqual('host');
        expect(user.id).toEqual(hostId);
      });
    });

    test('List users as an attendee only returns attendee details', async () => {
      const { status, data } = await axios.get<User[]>(BASE_URL, {
        headers: { Authorization: `Bearer ${attendeeToken}` }
      });
      expect(status).toBe(200);
      expect(data.length).toEqual(1);

      data.forEach(user => {
        expect(user.password).toBeUndefined();
        expect(user.role).toEqual('attendee');
        expect(user.id).toEqual(attendeeId);
      })
    });
  });
});
