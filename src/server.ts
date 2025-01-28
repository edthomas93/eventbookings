import express, { Express } from 'express';

import routers from './routers';
import { sequelize } from './database';

const app: Express = express();

const initialiseApp = async (): Promise<Express> => {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');

  app.get('/healthcheck', (req, res) => {
    res.status(200).send('OK');
  });
  app.use('/users', routers.users);
  return app;
};

export default initialiseApp;
