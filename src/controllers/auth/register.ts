import { v7 as uuid } from 'uuid';

import { UserRepository } from '../../repositories/user';
import { AuthService } from '../../services/auth';
import { Auth } from '../../types/api';
import { ConflictError } from '../../errors/errors';

export class RegisterController {
  private userRepository: UserRepository;
  private authService: AuthService;

  constructor(userRepository: UserRepository, authService: AuthService) {
    this.userRepository = userRepository;
    this.authService = authService;
  }

  async register(body: Auth['RegisterReqBody']): Promise<Auth['RegisterResBody']> {
    const { email, password, role, name } = body;

    const users = await this.userRepository.listWhere({ email });
    if (users.length) {
      throw new ConflictError('Email already in use');
    }

    const hashedPassword = await this.authService.hashPassword(password);

    const user = await this.userRepository.createUser({
      id: uuid(),
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = this.authService.generateToken(user.id, user.role);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
}
