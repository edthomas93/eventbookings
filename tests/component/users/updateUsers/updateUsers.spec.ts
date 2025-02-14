import request from 'supertest';
import { App } from 'supertest/types';
import { upSeedDB, downSeedDB, hostId, attendeeId, nonExistentUserId } from './seed';
import { AuthService } from '../../../../src/services/auth';
import { getTestApp } from '../../../testServer';
import { Users } from '../../../../src/types/api';

let app: App;

const auth = new AuthService();
const hostToken = auth.generateToken(hostId, 'host');
const attendeeToken = auth.generateToken(attendeeId, 'attendee');
const invalidToken = auth.generateToken(nonExistentUserId, 'attendee');

beforeAll(async () => {
  app = await getTestApp();
});

describe('PATCH /users/:userId', () => {
  beforeEach(async () => {
    await upSeedDB();
  });

  afterEach(async () => {
    await downSeedDB();
  });

  describe('Success', () => {
    test('User can update their own profile', async () => {
      const updateData: Users['PatchReqBody'] = { name: 'Updated Name' };

      const { status, body } = await request(app)
        .patch(`/users/${hostId}`)
        .set('Authorization', `Bearer ${hostToken}`)
        .send(updateData);

      expect(status).toEqual(200);
      expect(body.name).toEqual(updateData.name);
    });
  });

  describe('Failures', () => {
    test('User cannot update another user profile', async () => {
      const updateData: Users['PatchReqBody'] = { name: 'Hacker Name' };

      const { status, body } = await request(app)
        .patch(`/users/${hostId}`)
        .set('Authorization', `Bearer ${attendeeToken}`)
        .send(updateData);

      expect(status).toEqual(403);
      expect(body.message).toEqual(`User id of '${hostId}' provided does not match user details`);
    });

    test('User cannot update a non-existent user', async () => {
      const updateData: Users['PatchReqBody'] = { name: 'Does Not Exist' };

      const { status, body } = await request(app)
        .patch(`/users/${nonExistentUserId}`)
        .set('Authorization', `Bearer ${invalidToken}`)
        .send(updateData);

      expect(status).toEqual(404);
      expect(body.message).toEqual('User not found');
    });

    test('Cannot update fields not specified in the api documentation', async () => {
      const invalidUpdateData = { userId: '6292c865-4fe0-492f-b983-c062840bbc42' };

      const { status, body } = await request(app)
        .patch(`/users/${attendeeId}`)
        .set('Authorization', `Bearer ${attendeeToken}`)
        .send(invalidUpdateData);

      expect(status).toEqual(400);
      expect(body.error).toEqual('Validation failed');
      expect(body.details).toEqual([{ message: 'should NOT have additional properties' }]);
    });
  });
});
