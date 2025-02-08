import { v7 as uuid } from 'uuid';
import { Users } from '../../types/api';
import { ConflictError, ServerError } from '../../errors/errors';
import { User } from '../../models/users';
import { UserRepository } from '../../repositories/user';

export class CreateUserController {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(body: Users['PostReqBody']) {
    try {
      const match = await User.findAll({ where: { email: body.email } });
      if (match.length) {
        throw new ConflictError('Email already in use');
      }
      const user = {
        ...body,
        id: uuid(),
      };
      return this.userRepository.createUser(user);
    } catch (error) {
      if (error instanceof ConflictError) {
        throw error;
      }
      throw new ServerError('Failed to create new user');
    }
  }
}
