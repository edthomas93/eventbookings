import request from 'supertest';
import { App } from 'supertest/types';
import { upSeedDB, downSeedDB, hostId, attendeeId } from './seed';
import { Events } from '../../../../src/types/api';
import { AuthService } from '../../../../src/services/auth';
import { getTestApp } from '../../../testServer';

let app: App;

beforeAll(async () => {
  app = await getTestApp();
});

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
      const { status, body } = await request(app)
        .post('/events')
        .set('Authorization', `Bearer ${hostToken}`)
        .send(validEventBody);

      expect(status).toEqual(201);
      expect(body.eventId).toBeDefined();
      expect(body.hostId).toEqual(hostId);
      expect(body.title).toEqual(validEventBody.title);
      expect(body.description).toEqual(validEventBody.description);
      expect(body.startDateTime).toBeDefined(); // TODO: Fix formatting
      expect(body.endDateTime).toBeDefined();
    });
  });

  describe('Failures', () => {
    test('Attendee cannot create an event', async () => {
      const { status, body } = await request(app)
        .post('/events')
        .set('Authorization', `Bearer ${attendeeToken}`)
        .send(validEventBody);

      expect(status).toEqual(403);
      expect(body.message).toEqual('Only hosts can create events');
    });

    test('Cannot create an event without authentication', async () => {
      const { status, body } = await request(app).post('/events').send(validEventBody);

      expect(status).toEqual(401);
      expect(body.message).toEqual('Unauthorized: No token provided');
    });

    test('Cannot create an event in the past', async () => {
      const pastEventBody = {
        ...validEventBody,
        startDateTime: '2023-01-01T10:00:00Z',
        endDateTime: '2023-01-01T12:00:00Z',
      };

      const { status, body } = await request(app)
        .post('/events')
        .set('Authorization', `Bearer ${hostToken}`)
        .send(pastEventBody);

      expect(status).toEqual(400);
      expect(body.message).toEqual('Event cannot be scheduled in the past');
    });

    test('Cannot create an event with a duration shorter than 5 minutes', async () => {
      const shortEventBody = {
        ...validEventBody,
        startDateTime: '2025-06-15T09:00:00Z',
        endDateTime: '2025-06-15T09:02:00Z', // Less than 5 minutes
      };

      const { status, body } = await request(app)
        .post('/events')
        .set('Authorization', `Bearer ${hostToken}`)
        .send(shortEventBody);

      expect(status).toEqual(400);
      expect(body.message).toEqual('Event duration must be between 5 minutes and 2 weeks');
    });

    test('Cannot create an event with a duration longer than 2 weeks', async () => {
      const longEventBody = {
        ...validEventBody,
        startDateTime: '2025-06-01T09:00:00Z',
        endDateTime: '2025-06-30T09:00:00Z', // More than 2 weeks
      };

      const { status, body } = await request(app)
        .post('/events')
        .set('Authorization', `Bearer ${hostToken}`)
        .send(longEventBody);

      expect(status).toEqual(400);
      expect(body.message).toEqual('Event duration must be between 5 minutes and 2 weeks');
    });

    test('Cannot create an event where endDateTime is before startDateTime', async () => {
      const invalidDatesEventBody = {
        ...validEventBody,
        startDateTime: '2025-06-15T17:00:00Z',
        endDateTime: '2025-06-15T09:00:00Z',
      };

      const { status, body } = await request(app)
        .post('/events')
        .set('Authorization', `Bearer ${hostToken}`)
        .send(invalidDatesEventBody);

      expect(status).toEqual(400);
      expect(body.message).toEqual('Event end time must be after the start time');
    });

    test('Cannot create an event with invalid request body', async () => {
      const invalidBody = {
        title: '',
        startDateTime: 'invalid-date',
        endDateTime: '2025-06-15T17:00:00Z',
        capacity: 100,
      };

      const { status, body } = await request(app)
        .post('/events')
        .set('Authorization', `Bearer ${hostToken}`)
        .send(invalidBody);

      expect(status).toEqual(400);
      expect(body.error).toEqual('Validation failed');
      expect(body.details).toEqual([{ message: 'should match format "date-time"' }]);
    });
  });
});
