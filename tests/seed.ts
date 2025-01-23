import { sequelize, User, Event, Booking } from '../src/database';

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced successfully.');

    const host = await User.create({ id: '6c9ec223-5b59-4794-b553-7573d3d04e0f', name: 'John Doe', email: 'john@example.com', role: 'host' });
    const attendee = await User.create({ id: 'd7bd53c7-60ba-4603-84c8-1183b948d61e', name: 'Jane Smith', email: 'jane@example.com', role: 'attendee' });

    const event1 = await Event.create({
      id: 'fec0bdff-8e3a-48e9-b136-e3f8725a2bb8',
      title: 'Rock Concert',
      description: 'An amazing rock show!',
      hostId: host.id,
      startDateTime: new Date('2025-01-19T19:00:00'),
      endDateTime: new Date('2025-01-20T00:00:00'),
    });

    const event2 = await Event.create({
      id: '479c2503-f6c1-4068-bcd1-40f2ff31e837',
      title: 'Jazz Night',
      description: 'Smooth jazz evening.',
      hostId: host.id,
      startDateTime: new Date('2025-02-15T19:30:00'),
      endDateTime: new Date('2025-02-15T23:30:00'),
    });

    await Booking.create({ id: '300ce091-1018-4a57-9d4f-0c9151b97185', userId: attendee.id, eventId: event1.id });
    await Booking.create({ id: '9363600b-0e79-4993-8515-66e6d540aa2a', userId: attendee.id, eventId: event2.id });

    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    sequelize.close();
  }
};

export default seedDatabase;
