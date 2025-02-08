import { UserRepository } from '../../../src/repositories/user';
import { User } from '../../../src/models/users';

jest.mock('../../../src/models/users');

describe('UserRepository', () => {

  test('bleh', () => expect(true).toEqual(true));

  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
  });

  describe('findWhere', () => {
    test('Should return a list of users', async () => {
      const mockUsers = [
        { id: '1', name: 'Alice', email: 'alice@example.com', role: 'attendee' },
        { id: '2', name: 'Bob', email: 'bob@example.com', role: 'host' },
      ];
      (User.findAll as jest.Mock).mockResolvedValue(mockUsers);

      const users = await userRepository.listWhere({});

      expect(users).toEqual(mockUsers);
      expect(User.findAll).toHaveBeenCalledTimes(1);
    });
  })

  describe('getById', () => {
    test('Should return a user by id', async () => {
      const mockUser = { id: '1', name: 'Alice', email: 'alice@example.com', role: 'attendee' };
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const user = await userRepository.getById('1');

      expect(user).toEqual(mockUser);
      expect(User.findByPk).toHaveBeenCalledWith('1');
    });

    test('Should return null if user not found', async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      const user = await userRepository.getById('999');

      expect(user).toBeNull();
    });
  })
});
