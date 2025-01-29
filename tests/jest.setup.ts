import { sequelize } from '../src/database';

export default async () => {
  console.log('Connecting to database before all tests...');
  await sequelize.authenticate();
};
