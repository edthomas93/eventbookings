import { sequelize } from '../src/database';

export default async () => {
  console.log('Closing database connection after all tests...');
  await sequelize.close();
};
