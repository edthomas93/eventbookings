import axios from 'axios';

import { upSeedDB, downSeedDB, hostId, attendeeId } from './seed';
import { Events } from '../../../../src/types/api';
import { AuthService } from '../../../../src/services/auth';

const BASE_URL = 'http://localhost:3001/events';

const auth = new AuthService();

const hostToken = auth.generateToken(hostId, 'host');
const attendeeToken = auth.generateToken(attendeeId, 'attendee');

const validEventBody: Events['PostReqBody'] = {
  title: 'Tech Conference 2025',
  description: 'A conference for tech enthusiasts',
  startDateTime: '2025-06-15T09:00:00Z',
  endDateTime: '2025-06-15T17:00:00Z',
};

describe('POST /events', () => {

  beforeEach(async () => {
    await upSeedDB();
  });

  afterEach(async () => {
    await downSeedDB();
  });

  describe('Success', () => {
    test('Host can create an event successfully', async () => {
      const { status, data } = await axios.post(BASE_URL, validEventBody, {
        headers: { Authorization: `Bearer ${hostToken}` },
        validateStatus: () => true,
      });

      expect(status).toEqual(201);
      expect(data.id).toBeDefined();
      expect(data.hostId).toEqual(hostId);
      expect(data.title).toEqual(validEventBody.title);
      expect(data.description).toEqual(validEventBody.description);
      expect(data.startDateTime).toBeDefined(); // TODO: Fix formatting
      expect(data.endDateTime).toBeDefined();
    });
  });

  describe('Failures', () => {
    test('Attendee cannot create an event', async () => {
      const { status, data } = await axios.post(BASE_URL, validEventBody, {
        headers: { Authorization: `Bearer ${attendeeToken}` },
        validateStatus: () => true,
      });

      expect(status).toEqual(403);
      expect(data.message).toEqual('Only hosts can create events');
    });

    test('Cannot create an event without authentication', async () => {
      const { status, data } = await axios.post(BASE_URL, validEventBody, {
        validateStatus: () => true,
      });

      expect(status).toEqual(401);
      expect(data.message).toEqual('Unauthorized: No token provided');
    });

    test('Cannot create an event with invalid request body', async () => {
      const invalidBody = {
        title: '',
        startDateTime: 'invalid-date',
        endDateTime: '2025-06-15T17:00:00Z',
      };

      const { status, data } = await axios.post(BASE_URL, invalidBody, {
        headers: { Authorization: `Bearer ${hostToken}` },
        validateStatus: () => true,
      });

      expect(status).toEqual(400);
      expect(data.error).toEqual('Validation failed');
      expect(data.details).toEqual([{ message: 'should match format "date-time"' }]);
    });
  });
});
