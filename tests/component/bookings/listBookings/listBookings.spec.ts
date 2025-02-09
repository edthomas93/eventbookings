import axios from 'axios';
import { upSeedDB, downSeedDB, glastonburyEventId, attendeeId, hostId, hostId2 } from './seed';
import { AuthService } from '../../../../src/services/auth';
import { Bookings } from '../../../../src/types/api';

const BASE_URL = 'http://localhost:3001/bookings';
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
      const { status, data } = await axios.get<Bookings['ListResBody']>(BASE_URL, {
        headers: { Authorization: `Bearer ${host2Token}` },
        validateStatus: () => true,
      });

      expect(status).toEqual(200);
      expect(data.length).toEqual(1);
      data.forEach(booking => {
        expect(booking.id).toBeDefined()
        expect(booking.eventId).toEqual(glastonburyEventId);
        expect(booking.event.id).toEqual(booking.eventId);
      });
    });

    test('Host can retrieves no bookings if the events have no bookings', async () => {
      const { status, data } = await axios.get<Bookings['ListResBody']>(BASE_URL, {
        headers: { Authorization: `Bearer ${hostToken}` },
        validateStatus: () => true,
      });

      expect(status).toEqual(200);
      expect(data.length).toEqual(0);
    });

    test('Attendee can retrieve their own bookings', async () => {
      const { status, data } = await axios.get<Bookings['ListResBody']>(BASE_URL, {
        headers: { Authorization: `Bearer ${attendeeToken}` },
        validateStatus: () => true,
      });

      expect(status).toEqual(200);
      expect(data.length).toEqual(1);
      data.forEach(booking => {
        expect(booking.id).toBeDefined();
        expect(booking.userId).toEqual(attendeeId);
        expect(booking.eventId).toEqual(glastonburyEventId);
        expect(booking.event.id).toEqual(booking.eventId);
      });
    });
  });

  describe('Failures', () => {
    test('Cannot list bookings without authentication', async () => {
      const { status, data } = await axios.get(BASE_URL, {
        validateStatus: () => true,
      });

      expect(status).toEqual(401);
      expect(data.message).toEqual('Unauthorized: No token provided');
    });
  });
});
