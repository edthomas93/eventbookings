import { User } from '../../../../src/models/users';

export const hostId = '6c9ec223-5b59-4794-b553-7573d3d04e0f';
export const attendeeId = 'd7bd53c7-60ba-4603-84c8-1183b948d61e';
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
