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
  capacity: 10,
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

    test('Cannot create an event in the past', async () => {
      const pastEventBody = {
        ...validEventBody,
        startDateTime: '2023-01-01T10:00:00Z',
        endDateTime: '2023-01-01T12:00:00Z',
      };

      const { status, data } = await axios.post(BASE_URL, pastEventBody, {
        headers: { Authorization: `Bearer ${hostToken}` },
        validateStatus: () => true,
      });

      expect(status).toEqual(400);
      expect(data.message).toEqual('Event cannot be scheduled in the past');
    });

    test('Cannot create an event with a duration shorter than 5 minutes', async () => {
      const shortEventBody = {
        ...validEventBody,
        startDateTime: '2025-06-15T09:00:00Z',
        endDateTime: '2025-06-15T09:02:00Z', // Less than 5 minutes
      };

      const { status, data } = await axios.post(BASE_URL, shortEventBody, {
        headers: { Authorization: `Bearer ${hostToken}` },
        validateStatus: () => true,
      });

      expect(status).toEqual(400);
      expect(data.message).toEqual('Event duration must be between 5 minutes and 2 weeks');
    });

    test('Cannot create an event with a duration longer than 2 weeks', async () => {
      const longEventBody = {
        ...validEventBody,
        startDateTime: '2025-06-01T09:00:00Z',
        endDateTime: '2025-06-30T09:00:00Z', // More than 2 weeks
      };

      const { status, data } = await axios.post(BASE_URL, longEventBody, {
        headers: { Authorization: `Bearer ${hostToken}` },
        validateStatus: () => true,
      });

      expect(status).toEqual(400);
      expect(data.message).toEqual('Event duration must be between 5 minutes and 2 weeks');
    });

    test('Cannot create an event where endDateTime is before startDateTime', async () => {
      const invalidEventBody = {
        ...validEventBody,
        startDateTime: '2025-06-15T17:00:00Z',
        endDateTime: '2025-06-15T09:00:00Z',
      };

      const { status, data } = await axios.post(BASE_URL, invalidEventBody, {
        headers: { Authorization: `Bearer ${hostToken}` },
        validateStatus: () => true,
      });

      expect(status).toEqual(400);
      expect(data.message).toEqual('Event end time must be after the start time');
    });

    test('Cannot create an event with invalid request body', async () => {
      const invalidBody = {
        title: '',
        startDateTime: 'invalid-date',
        endDateTime: '2025-06-15T17:00:00Z',
        capacity: 100,
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
