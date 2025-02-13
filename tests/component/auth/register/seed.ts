import { User } from '../../../../src/models/users';

const existingUserId = 'f42d72d5-299f-4490-a158-9a3af3088360';
export const existingUserEmail = 'existing@example.com';
export const newUserEmail = 'new@example.com';

const upSeedDB = async () => {
  try {
    await User.create({
      userId: existingUserId,
      name: 'Existing User',
      email: existingUserEmail,
      password: 'Password1234',
      role: 'attendee',
    });

    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

const downSeedDB = async () => {
  try {
    await User.destroy({
      where: {
        email: [
          existingUserEmail,
          newUserEmail,
        ],
      },
    });

    console.log('Database unseeded successfully.');
  } catch (error) {
    console.error('Error unseeding database:', error);
  }
};

export { upSeedDB, downSeedDB };
