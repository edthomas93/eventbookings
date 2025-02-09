import { User } from '../../../../src/models/users';
import { Booking } from '../../../../src/models/bookings';
import { Event } from '../../../../src/models/events';

const hostId = '6c9ec223-5b59-4794-b553-7573d3d04e0f';
const attendeeId = 'd7bd53c7-60ba-4603-84c8-1183b948d61e';
const rockEventId = 'fec0bdff-8e3a-48e9-b136-e3f8725a2bb8';
const jazzEventId = '479c2503-f6c1-4068-bcd1-40f2ff31e837';
const bookingId1 = '300ce091-1018-4a57-9d4f-0c9151b97185';
const bookingId2 = '9363600b-0e79-4993-8515-66e6d540aa2a';

const upSeedDB = async () => {
  try {
    const host = await User.create({ id: hostId, name: 'John Doe', email: 'john@example.com', role: 'host', password: 'Password1234' });
    const attendee = await User.create({ id: attendeeId, name: 'Jane Smith', email: 'jane@example.com', role: 'attendee', password: 'Password1234' });

    const event1 = await Event.create({
      id: rockEventId,
      title: 'Rock Concert',
      description: 'An amazing rock show!',
      hostId: host.id,
      startDateTime: new Date('2025-01-19T19:00:00'),
      endDateTime: new Date('2025-01-20T00:00:00'),
      capacity: 10,
    });

    const event2 = await Event.create({
      id: jazzEventId,
      title: 'Jazz Night',
      description: 'Smooth jazz evening.',
      hostId: host.id,
      startDateTime: new Date('2025-02-15T19:30:00'),
      endDateTime: new Date('2025-02-15T23:30:00'),
      capacity: 10,
    });

    await Booking.create({ id: bookingId1, userId: attendee.id, eventId: event1.id });
    await Booking.create({ id: bookingId2, userId: attendee.id, eventId: event2.id });

    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

const downSeedDB = async () => {
  try {
    await Booking.destroy({
      where: {
        id: [
          bookingId1,
          bookingId2,
        ],
      },
    });

    await Event.destroy({
      where: {
        id: [
          rockEventId,
          jazzEventId,
        ],
      },
    });

    await User.destroy({
      where: {
        id: [
          hostId,
          attendeeId,
        ],
      },
    });

    console.log('Database unseeded successfully.');
  } catch (error) {
    console.error('Error unseeding database:', error);
  }
};

export { upSeedDB, downSeedDB };
