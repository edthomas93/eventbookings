import express, { Express } from 'express';

import routers from './routers';
import { sequelize } from './database';

const app: Express = express();

const initialiseApp = async (): Promise<Express> => {
  await sequelize.sync({ force: true }); // TODO: update this once there's a dedicated DB server
  console.log('Connection has been established successfully.');

  app.get('/healthcheck', (req, res) => {
    res.status(200).send('OK');
  });
  app.use('/users', routers.users);
  return app;
};

export default initialiseApp;
