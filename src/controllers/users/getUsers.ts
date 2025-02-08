import { UserRepository } from '../../repositories/user';

export class GetUsersController {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute() {
    return this.userRepository.listWhere({});
  }
}
