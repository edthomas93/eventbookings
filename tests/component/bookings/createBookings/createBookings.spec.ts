import request from 'supertest';
import { App } from 'supertest/types';
import { upSeedDB, downSeedDB, hostId, attendeeId, glastonburyEventId, rockEventId, jazzEventId, wildernessEventId } from './seed';
import { AuthService } from '../../../../src/services/auth';
import { getTestApp } from '../../../testServer';

let app: App;

beforeAll(async () => {
  app = await getTestApp();
});

const auth = new AuthService();
const hostToken = auth.generateToken(hostId, 'host');
const attendeeToken = auth.generateToken(attendeeId, 'attendee');

describe('POST /bookings', () => {
  beforeEach(async () => {
    await upSeedDB();
  });

  afterEach(async () => {
    await downSeedDB();
  });

  describe('Success', () => {
    test('Attendee can create a booking successfully', async () => {
      const { status, body } = await request(app)
        .post('/bookings')
        .set('Authorization', `Bearer ${attendeeToken}`)
        .send({ eventId: glastonburyEventId });

      expect(status).toEqual(201);
      expect(body.id).toBeDefined();
      expect(body.userId).toEqual(attendeeId);
      expect(body.eventId).toEqual(glastonburyEventId);
    });
  });

  describe('Failures', () => {
    test('Host cannot book an event', async () => {
      const { status, body } = await request(app)
        .post('/bookings')
        .set('Authorization', `Bearer ${hostToken}`)
        .send({ eventId: glastonburyEventId });

      expect(status).toEqual(403);
      expect(body.message).toEqual('Only attendees can book events');
    });

    test('Cannot create a booking without authentication', async () => {
      const { status, body } = await request(app)
        .post('/bookings')
        .send({ eventId: glastonburyEventId });

      expect(status).toEqual(401);
      expect(body.message).toEqual('Unauthorized: No token provided');
    });

    test('Cannot create a booking for a non-existent event', async () => {
      const { status, body } = await request(app)
        .post('/bookings')
        .set('Authorization', `Bearer ${attendeeToken}`)
        .send({ eventId: 'd5b2c8bd-30b1-4dc4-9add-2206e31511f3' });

      expect(status).toEqual(404);
      expect(body.message).toEqual('Event not found');
    });

    test('Cannot create a duplicate booking for the same event and user', async () => {
      const { status, body } = await request(app)
        .post('/bookings')
        .set('Authorization', `Bearer ${attendeeToken}`)
        .send({ eventId: rockEventId });

      expect(status).toEqual(409);
      expect(body.message).toEqual('User has already booked this event');
    });

    test('Cannot create a booking for a past event', async () => {
      const { status, body } = await request(app)
        .post('/bookings')
        .set('Authorization', `Bearer ${attendeeToken}`)
        .send({ eventId: jazzEventId });

      expect(status).toEqual(409);
      expect(body.message).toEqual('Cannot book an event that has already ended');
    });

    test('Cannot create a booking if event is at full capacity', async () => {
      const { status, body } = await request(app)
        .post('/bookings')
        .set('Authorization', `Bearer ${attendeeToken}`)
        .send({ eventId: wildernessEventId });

      expect(status).toEqual(409);
      expect(body.message).toEqual('Event capacity exceeded');
    });

    test('Cannot create a booking with an invalid request body', async () => {
      const invalidBody = {};

      const { status, body } = await request(app)
        .post('/bookings')
        .set('Authorization', `Bearer ${attendeeToken}`)
        .send(invalidBody);

      expect(status).toEqual(400);
      expect(body.error).toEqual('Validation failed');
      expect(body.details).toEqual([{ message: `should have required property 'eventId'` }]);
    });
  });
});
