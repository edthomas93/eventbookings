import request from 'supertest';
import { App } from 'supertest/types';
import { upSeedDB, downSeedDB } from './seed';
import { getTestApp } from '../../../testServer';

let app: App;

beforeAll(async () => {
  app = await getTestApp();
});

describe('GET /events', () => {

  beforeEach(async () => {
    await upSeedDB();
  });

  afterEach(async () => {
    await downSeedDB();
  });

  describe('Success', () => {
    test('Retrieves events', async () => {
      const { status, body } = await request(app).get('/events');
      expect(status).toEqual(200);
      expect(body.length).toEqual(2);
    });
  });
});
