import { Event } from '../../../../src/models/events';
import { Booking } from '../../../../src/models/bookings';
import { User } from '../../../../src/models/users';

export const hostId = 'dd78c8f1-44ef-4cbd-9197-12cd6fceb2b6';
export const hostId2 = '284dfb3d-b91e-440e-aa34-097a7c6a63ee';
export const attendeeId = '05f451be-f3ce-4b7b-9386-25b7bbc0e990';
const rockEventId = '7cc85305-78ea-4e8b-a66e-f0a690c5dde1';
const jazzEventId = '19d33286-31f6-41e8-b15c-8e9f5f150b9b';
export const glastonburyEventId = '0b75eebe-b7bb-4ec6-a5d9-a513f73b16ea';
const bookingId = '2dd62b37-e113-4d93-87eb-946b6af6b622';

const upSeedDB = async () => {
  try {
    const host = await User.create({ userId: hostId, name: 'John Doe', email: 'john@example.com', role: 'host', password: 'Password1234' });
    const host2 = await User.create({ userId: hostId2, name: 'Guillaume Bouchet', email: 'allezlesbleus@example.com', role: 'host', password: 'Password1234' });
    const attendee = await User.create({ userId: attendeeId, name: 'Jane Smith', email: 'jane@example.com', role: 'attendee', password: 'Password1234' });

    await Event.create({
      eventId: rockEventId,
      title: 'Rock Concert',
      description: 'An amazing rock show!',
      hostId: host.userId,
      startDateTime: new Date('2025-01-19T19:00:00'),
      endDateTime: new Date('2025-01-20T00:00:00'),
      capacity: 10,
    });

    await Event.create({
      eventId: jazzEventId,
      title: 'Jazz Night',
      description: 'Smooth jazz evening.',
      hostId: host.userId,
      startDateTime: new Date('2025-02-15T19:30:00'),
      endDateTime: new Date('2025-02-15T23:30:00'),
      capacity: 10,
    });

    const event = await Event.create({
      eventId: glastonburyEventId,
      title: 'Glastonbury',
      description: 'The Legendary music festival returns to Worthy Farm',
      hostId: host2.userId,
      startDateTime: new Date('2026-06-15T10:30:00'),
      endDateTime: new Date('2026-06-20T23:30:00'),
      capacity: 10,
    });

    await Booking.create({ bookingId: bookingId, userId: attendee.userId, eventId: event.eventId });

    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

const downSeedDB = async () => {
  try {
    await Booking.destroy({
      where: { bookingId },
    });

    await Event.destroy({
      where: {
        eventId: [
          rockEventId,
          jazzEventId,
          glastonburyEventId,
        ],
      },
    });

    await User.destroy({
      where: {
        userId: [
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
