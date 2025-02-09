import axios from 'axios';

import { upSeedDB, downSeedDB, hostId, attendeeId, glastonburyEventId, rockEventId, jazzEventId, wildernessEventId } from './seed';
import { Bookings } from '../../../../src/types/api';
import { AuthService } from '../../../../src/services/auth';

const BASE_URL = 'http://localhost:3001/bookings';

const auth = new AuthService();

const hostToken = auth.generateToken(hostId, 'host');
const attendeeToken = auth.generateToken(attendeeId, 'attendee');

const validBookingBody: Bookings['PostReqBody'] = {
  eventId: glastonburyEventId,
};

describe('POST /bookings', () => {

  beforeEach(async () => {
    await upSeedDB();
  });

  afterEach(async () => {
    await downSeedDB();
  });

  describe('Success', () => {
    test('Attendee can create a booking successfully', async () => {
      const { status, data } = await axios.post(BASE_URL, validBookingBody, {
        headers: { Authorization: `Bearer ${attendeeToken}` },
        validateStatus: () => true,
      });

      expect(status).toEqual(201);
      expect(data.id).toBeDefined();
      expect(data.userId).toEqual(attendeeId);
      expect(data.eventId).toEqual(glastonburyEventId);
    });
  });

  describe('Failures', () => {
    test('Host cannot book an event', async () => {
      const { status, data } = await axios.post(BASE_URL, validBookingBody, {
        headers: { Authorization: `Bearer ${hostToken}` },
        validateStatus: () => true,
      });

      expect(status).toEqual(403);
      expect(data.message).toEqual('Only attendees can book events');
    });

    test('Cannot create a booking without authentication', async () => {
      const { status, data } = await axios.post(BASE_URL, validBookingBody, {
        validateStatus: () => true,
      });

      expect(status).toEqual(401);
      expect(data.message).toEqual('Unauthorized: No token provided');
    });

    test('Cannot create a booking for a non-existent event', async () => {
      const invalidBookingBody = { eventId: 'b32a12ea-1acc-4b96-8fac-7344b8a63456' };

      const { status, data } = await axios.post(BASE_URL, invalidBookingBody, {
        headers: { Authorization: `Bearer ${attendeeToken}` },
        validateStatus: () => true,
      });

      expect(status).toEqual(404);
      expect(data.message).toEqual('Event not found');
    });

    test('Cannot create a duplicate booking for the same event and user', async () => {
      const { status, data } = await axios.post(BASE_URL, { eventId: rockEventId }, {
        headers: { Authorization: `Bearer ${attendeeToken}` },
        validateStatus: () => true,
      });

      expect(status).toEqual(409);
      expect(data.message).toEqual('User has already booked this event');
    });

    test('Cannot create a booking for a past event', async () => {
      const { status, data } = await axios.post(BASE_URL, { eventId: jazzEventId }, {
        headers: { Authorization: `Bearer ${attendeeToken}` },
        validateStatus: () => true,
      });

      expect(status).toEqual(409);
      expect(data.message).toEqual('Cannot book an event that has already ended');
    });

    test('Cannot create a booking if event is at full capacity', async () => {
      const { status, data } = await axios.post(BASE_URL, { eventId: wildernessEventId }, {
        headers: { Authorization: `Bearer ${attendeeToken}` },
        validateStatus: () => true,
      });

      expect(status).toEqual(409);
      expect(data.message).toEqual('Event capacity exceeded');
    });

    test('Cannot create a booking with an invalid request body', async () => {
      const invalidBody = {};

      const { status, data } = await axios.post(BASE_URL, invalidBody, {
        headers: { Authorization: `Bearer ${attendeeToken}` },
        validateStatus: () => true,
      });

      expect(status).toEqual(400);
      expect(data.error).toEqual('Validation failed');
      expect(data.details).toEqual([{ message: `should have required property 'eventId'` }]);
    });
  });
});
