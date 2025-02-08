import { Op } from 'sequelize';
import { User } from '../../../../src/models/users';

const hostId = 'afe9f901-d0cf-48f9-8730-09b55c679806';

const upSeedDB = async () => {
  try {
    await User.create({ id: hostId, name: 'John Doe', email: 'ed@example.com', role: 'host' });
    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

const downSeedDB = async () => {
  try {
    await User.destroy({
      where: {
        [Op.or]: [
          { id: hostId },
          { name: { [Op.in]: ['Ed Thomas'] } }
        ]
      },
    });
  } catch (error) {
    console.error('Error unseeding database:', error);
  }
};

export { upSeedDB, downSeedDB };
