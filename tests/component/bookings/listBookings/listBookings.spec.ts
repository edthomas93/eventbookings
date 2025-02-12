import request from 'supertest';
import { App } from 'supertest/types';
import { upSeedDB, downSeedDB, glastonburyEventId, attendeeId, hostId, hostId2 } from './seed';
import { AuthService } from '../../../../src/services/auth';
import { getTestApp } from '../../../testServer';
import { Bookings } from '../../../../src/types/api';

let app: App;

beforeAll(async () => {
  app = await getTestApp();
});

const auth = new AuthService();
const hostToken = auth.generateToken(hostId, 'host');
const host2Token = auth.generateToken(hostId2, 'host');
const attendeeToken = auth.generateToken(attendeeId, 'attendee');

describe('GET /bookings', () => {
  beforeEach(async () => {
    await upSeedDB();
  });

  afterEach(async () => {
    await downSeedDB();
  });

  describe('Success', () => {
    test('Host can retrieve all bookings for their events', async () => {
      const { status, body } = await request(app)
        .get('/bookings')
        .set('Authorization', `Bearer ${host2Token}`);

      const bookings: Bookings['ListResBody'] = body;

      expect(status).toEqual(200);
      expect(bookings.length).toEqual(1);
      bookings.forEach(booking => {
        expect(booking.id).toBeDefined();
        expect(booking.eventId).toEqual(glastonburyEventId);
      });
    });

    test('Host can retrieves no bookings if the events have no bookings', async () => {
      const { status, body } = await request(app)
        .get('/bookings')
        .set('Authorization', `Bearer ${hostToken}`);

      expect(status).toEqual(200);
      expect(body.length).toEqual(0);
    });

    test('Attendee can retrieve their own bookings', async () => {
      const { status, body } = await request(app)
        .get('/bookings')
        .set('Authorization', `Bearer ${attendeeToken}`);

      const bookings: Bookings['ListResBody'] = body;

      expect(status).toEqual(200);
      expect(body.length).toEqual(1);
      bookings.forEach(booking => {
        expect(booking.id).toBeDefined();
        expect(booking.userId).toEqual(attendeeId);
        expect(booking.eventId).toEqual(glastonburyEventId);
        expect(booking.event.id).toEqual(booking.eventId);
      });
    });
  });

  describe('Failures', () => {
    test('Cannot list bookings without authentication', async () => {
      const { status, body } = await request(app).get('/bookings');

      expect(status).toEqual(401);
      expect(body.message).toEqual('Unauthorized: No token provided');
    });
  });
});
