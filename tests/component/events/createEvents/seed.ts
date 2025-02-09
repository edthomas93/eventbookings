import { User } from '../../../../src/models/users';
import { Event } from '../../../../src/models/events';

export const hostId = '6a7c729b-41b9-45b1-8301-72bd196039de';
export const attendeeId = 'f8e1ef1a-59f8-41fc-a0a9-c297a4af4d82';

const upSeedDB = async () => {
  try {
    await User.create({ id: hostId, name: 'John Doe', email: 'john@example.com', role: 'host', password: 'Password1234' });
    await User.create({ id: attendeeId, name: 'Jane Smith', email: 'jane@example.com', role: 'attendee', password: 'Password1234' });

    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

const downSeedDB = async () => {
  try {
    await Event.destroy({
      where: { hostId },
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
