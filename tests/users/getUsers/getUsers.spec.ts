import axios from 'axios';
import { upSeedDB, downSeedDB } from './seed';

const BASE_URL = 'http://localhost:3001/users';

describe('GET /users', () => {

  beforeAll(async () => {
    await upSeedDB();
  });

  afterAll(async () => {
    await downSeedDB();
  });

  describe('Success', () => {
    test('Retrieves users', async () => {
      const { status, data } = await axios.get(BASE_URL);
      expect(status).toBe(200);
      expect(data.length).toEqual(2);
    });
  });
});
