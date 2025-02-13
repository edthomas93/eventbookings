import { User } from '../../../../src/models/users';
import { AuthService } from '../../../../src/services/auth';

export const hostId = 'cd5b95e8-6a6c-4bb2-9ab0-998f7cbb58c8';
export const password = 'Password1234';

const upSeedDB = async () => {
  try {
    const hashedPassword = await new AuthService().hashPassword(password);
    await User.create({ userId: hostId, name: 'John Doe', email: 'ed@example.com', role: 'host', password: hashedPassword });

    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

const downSeedDB = async () => {
  try {
    await User.destroy({
      where: {
        userId: hostId,
      },
    });

    console.log('Database unseeded successfully.');
  } catch (error) {
    console.error('Error unseeding database:', error);
  }
};

export { upSeedDB, downSeedDB };
