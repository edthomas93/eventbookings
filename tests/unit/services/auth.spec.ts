import { AuthService } from '../../../src/services/auth';

describe('AuthService', () => {
  let authService: AuthService;
  const userId = '1234';
  const role = 'host';
  const password = 'password123';

  beforeEach(() => {
    authService = new AuthService();
  });

  describe('hashPassword', () => {
    it('should hash the password correctly', async () => {
      const hashedPassword = await authService.hashPassword(password);
      expect(hashedPassword).not.toEqual(password);
      expect(hashedPassword.length).toBeGreaterThan(10);
    });
  });

  describe('comparePasswords', () => {
    it('should return true if passwords match', async () => {
      const hashedPassword = await authService.hashPassword(password);
      const isMatch = await authService.comparePasswords(password, hashedPassword);
      expect(isMatch).toEqual(true);
    });

    it('should return false if passwords do not match', async () => {
      const hashedPassword = await authService.hashPassword(password);
      const isMatch = await authService.comparePasswords('wrongPassword', hashedPassword);
      expect(isMatch).toEqual(false);
    });
  });

  describe('generateToken', () => {
    it('should generate a JWT token using JWT_SECRET', () => {
      const token = authService.generateToken(userId, role);
      expect(typeof token).toEqual('string');
      expect(token.split('.').length).toEqual(3);
    });
  });

  describe('verifyToken', () => {
    it('should verify and decode a JWT token correctly', () => {
      const token = authService.generateToken(userId, role);
      const decoded = authService.verifyToken(token);

      expect(decoded).toMatchObject({ userId, role });
      expect(decoded.exp).toBeDefined();
    });

    it('should throw an error if the token is invalid', () => {
      expect(() => authService.verifyToken('invalidToken')).toThrow();
    });
  });
});
