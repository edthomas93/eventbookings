import { UserRepository } from '../../repositories/user';
import { AuthService } from '../../services/auth';
import { Auth } from '../../types/api';
import { NotFoundError, UnauthorizedError } from '../../errors/errors';

export class LoginController {
  private userRepository: UserRepository;
  private authService: AuthService;

  constructor(userRepository: UserRepository, authService: AuthService) {
    this.userRepository = userRepository;
    this.authService = authService;
  }

  async login(body: Auth['LoginReqBody']): Promise<Auth['LoginResBody']> {
    const { email, password } = body;

    const user = await this.userRepository.getUserWithPassword({ email });

    if (!user) {
      throw new NotFoundError(`No user found matching email '${email}'`);
    }

    const hashedPassword = user.password;
    const match = await this.authService.comparePasswords(password, hashedPassword);

    if (!match) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = this.authService.generateToken(user.id, user.role);

    return { token };
  }
}
