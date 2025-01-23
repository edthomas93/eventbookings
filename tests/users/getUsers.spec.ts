import axios from 'axios';
import seed from '../seed';

const BASE_URL = 'http://localhost:3001/users';

describe('GET /users', () => {

  beforeAll(async () => {
    await seed();
  });

  describe('Success', () => {
    test('Retrieves users', async () => {
      const { status, data } = await axios.get(BASE_URL);
      expect(status).toBe(200);
      expect(data.length).toEqual(2);
    });
  });
});
