import express, { Express } from 'express';

import routers from './routers';

const app: Express = express();

const initialiseApp = async (): Promise<Express> => {
  app.get('/healthcheck', (req, res) => {
    res.status(200).send('OK');
  });
  app.use('/events/users', routers.users);
  return app;
};

export default initialiseApp;
