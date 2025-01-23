const axios = require('axios');

const BASE_URL = 'http://localhost:3001/events/users';

describe('GET /users', () => {
  describe('Success', () => {
    test('Retrieves users', async () => {
      const { status } = await axios.get(BASE_URL);

      expect(status).toBe(200);
    });
  });
});
