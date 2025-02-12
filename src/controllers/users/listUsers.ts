import { UserRepository } from '../../repositories/user';
import { UserDetails } from '../../types/auth';

export class ListUsersController {
  private userId: string;
  private userRepository: UserRepository;

  constructor(
    userDetails: UserDetails,
    userRepository: UserRepository,
  ) {
    this.userId = userDetails.userId;
    this.userRepository = userRepository;
  }

  async execute() {
    return this.userRepository.listWhere({ id: this.userId });
  }
}
