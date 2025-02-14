import { ForbiddenError, NotFoundError } from '../../errors/errors';
import { UserRepository } from '../../repositories/user';
import { Users } from '../../types/api';
import { UserDetails } from '../../types/auth';

export class UpdateUsersController {
  private userId: string;
  private userRepository: UserRepository;

  constructor(
    userDetails: UserDetails,
    userRepository: UserRepository,
  ) {
    this.userId = userDetails.userId;
    this.userRepository = userRepository;
  }

  async execute(userId: string, updateDate: Users['PatchReqBody']) {
    if (userId !== this.userId) {
      throw new ForbiddenError(`User id of '${userId}' provided does not match user details`);
    }
    const user = await this.userRepository.updateUser(this.userId, updateDate);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }
}
