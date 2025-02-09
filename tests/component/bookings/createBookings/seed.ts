import { Event } from '../../../../src/models/events';
import { Booking } from '../../../../src/models/bookings';
import { User } from '../../../../src/models/users';

export const hostId = 'f42d72d5-299f-4490-a158-9a3af3088360';
export const hostId2 = '32c61746-703e-4eca-8caa-8a05c6a4caf2';
export const attendeeId = 'fcb84b76-79d7-45af-8ad6-4ae819e77bf6';
export const rockEventId = 'a2e19700-e7a4-46db-abbe-398baaf42fd6';
export const jazzEventId = 'b837d424-38dd-4a2c-a793-c674954676e9';
export const glastonburyEventId = 'a1f74b95-31f6-4210-a42e-4e3bd8fe6820';
export const wildernessEventId = '8447d78c-6b7e-4d32-b009-0b9bed41ecb8';
const bookingId1 = 'd9e7d816-958f-4463-aa16-5814d5c62e79';

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

    await Event.create({
      id: jazzEventId,
      title: 'Jazz Night',
      description: 'Smooth jazz evening.',
      hostId: host.id,
      startDateTime: new Date('2024-02-15T19:30:00'),
      endDateTime: new Date('2024-02-15T23:30:00'), // PAST EVENT
      capacity: 15,
    });

    await Event.create({
      id: glastonburyEventId,
      title: 'Glastonbury',
      description: 'The Legendary music festival returns to Worthy Farm',
      hostId: host.id,
      startDateTime: new Date('2026-06-15T10:30:00'),
      endDateTime: new Date('2026-06-20T23:30:00'),
      capacity: 20,
    });

    await Event.create({
      id: wildernessEventId,
      title: 'Wilderness',
      description: 'Get in the field and get dancing!',
      hostId: host.id,
      startDateTime: new Date('2026-06-15T10:30:00'),
      endDateTime: new Date('2026-06-20T23:30:00'),
      capacity: 20,
      numberOfAttendees: 20,
    });

    await Booking.create({ id: bookingId1, userId: attendee.id, eventId: event1.id });

    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

const downSeedDB = async () => {
  try {
    await Booking.destroy({
      where: {
        eventId: [
          rockEventId,
          jazzEventId,
          glastonburyEventId,
          wildernessEventId,
        ],
      },
    });

    await Event.destroy({
      where: {
        id: [
          rockEventId,
          jazzEventId,
          glastonburyEventId,
          wildernessEventId,
        ],
      },
    });

    await User.destroy({
      where: {
        id: [
          hostId,
          hostId2,
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
