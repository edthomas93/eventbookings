import axios from 'axios';
import { upSeedDB, downSeedDB } from './seed';

const BASE_URL = 'http://localhost:3001/users';

describe('GET /users', () => {

  beforeEach(async () => {
    await upSeedDB();
  });

  afterEach(async () => {
    await downSeedDB();
  });

  describe('Success', () => {
    test('List users', async () => {
      const { status, data } = await axios.get(BASE_URL);
      expect(status).toBe(200);
      expect(data.length).toEqual(2);
    });
  });
});
