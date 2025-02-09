import { User } from '../../../../src/models/users';
import { Event } from '../../../../src/models/events';

const hostId = '8abe472b-688d-4440-b5bf-9099c9a30bf4';
const attendeeId = 'f76a712b-6077-485f-b485-80c1d2988a37';
const rockEventId = 'edff9761-14e1-460e-bee8-6375db7f2562';
const jazzEventId = '7164487e-1c67-41a8-b732-89557243d46c';

const upSeedDB = async () => {
  try {
    const host = await User.create({ id: hostId, name: 'John Doe', email: 'john@example.com', role: 'host', password: 'Password1234' });
    await User.create({ id: attendeeId, name: 'Jane Smith', email: 'jane@example.com', role: 'attendee', password: 'Password1234' });

    await Event.create({
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
      startDateTime: new Date('2025-02-15T19:30:00'),
      endDateTime: new Date('2025-02-15T23:30:00'),
      capacity: 10,
    });

    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

const downSeedDB = async () => {
  try {
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
