import express, { Express } from 'express';
import bodyParser from 'body-parser';

import path from 'path';

import routers from './routers';
import { sequelize } from './database';
import errorHandler from './middleware/errorHandler';
import inputValidation from 'openapi-validator-middleware';

const app: Express = express();

const openApiPath = path.join(__dirname, "../definitions/openapi.yaml");
console.log("Loading OpenAPI Spec From:", openApiPath);

inputValidation.init(openApiPath);

const initialiseApp = async (): Promise<Express> => {
  await sequelize.sync({ force: true }); // TODO: update this once there's a dedicated DB server
  console.log('Connection has been established successfully.');

  app.use(bodyParser.json());

  app.get('/healthcheck', (req, res) => {
    res.status(200).send('OK');
  });
  app.use('/users', routers.users);

  app.use(errorHandler);

  return app;
};

export default initialiseApp;
