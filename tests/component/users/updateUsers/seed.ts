import { User } from '../../../../src/models/users';

export const hostId = 'fbf528f0-c1ee-47dc-af8c-7f2e890f7085';
export const attendeeId = '1c7281bf-1b95-45f8-8649-d59106429b39';
export const nonExistentUserId = 'aa1e9ebc-69c3-4d00-b080-ae6013eff5dc';

const upSeedDB = async () => {
  try {
    await User.create({ userId: hostId, name: 'John Doe', email: 'john@example.com', role: 'host', password: 'Password1234' });
    await User.create({ userId: attendeeId, name: 'Jane Smith', email: 'jane@example.com', role: 'attendee', password: 'Password1234' });

    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

const downSeedDB = async () => {
  try {
    await User.destroy({
      where: {
        userId: [
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
