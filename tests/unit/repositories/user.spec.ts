import { UserRepository } from '../../../src/repositories/user';
import { User } from '../../../src/models/users';

jest.mock('../../../src/models/users');

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
    jest.clearAllMocks();
  });

  describe('listWhere', () => {
    test('Should return a list of users', async () => {
      const mockUsers = [
        {
          userId: '1',
          name: 'Alice',
          email: 'alice@example.com',
          role: 'attendee',
          createdAt: new Date(),
          updatedAt: new Date(),
          dataValues: {
            userId: '1',
            name: 'Alice',
            email: 'alice@example.com',
            role: 'attendee',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
        {
          userId: '2',
          name: 'Bob',
          email: 'bob@example.com',
          role: 'host',
          createdAt: new Date(),
          updatedAt: new Date(),
          dataValues: {
            userId: '2',
            name: 'Bob',
            email: 'bob@example.com',
            role: 'host',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      ];

      (User.findAll as jest.Mock).mockResolvedValue(mockUsers);

      const users = await userRepository.listWhere({});

      expect(users).toEqual([
        {
          userId: '1',
          name: 'Alice',
          email: 'alice@example.com',
          role: 'attendee',
          createdAt: mockUsers[0].createdAt.toISOString(),
          updatedAt: mockUsers[0].updatedAt.toISOString(),
        },
        {
          userId: '2',
          name: 'Bob',
          email: 'bob@example.com',
          role: 'host',
          createdAt: mockUsers[1].createdAt.toISOString(),
          updatedAt: mockUsers[1].updatedAt.toISOString(),
        },
      ]);
      expect(User.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getById', () => {
    test('Should return a user by id', async () => {
      const mockUser = {
        userId: '1',
        name: 'Alice',
        email: 'alice@example.com',
        role: 'attendee',
        createdAt: new Date(),
        updatedAt: new Date(),
        dataValues: {
          userId: '1',
          name: 'Alice',
          email: 'alice@example.com',
          role: 'attendee',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const user = await userRepository.getById('1');

      expect(user).toEqual({
        userId: '1',
        name: 'Alice',
        email: 'alice@example.com',
        role: 'attendee',
        createdAt: mockUser.createdAt.toISOString(),
        updatedAt: mockUser.updatedAt.toISOString(),
      });
      expect(User.findByPk).toHaveBeenCalledWith('1');
    });

    test('Should return null if user not found', async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      const user = await userRepository.getById('999');

      expect(user).toBeNull();
    });
  });
});
