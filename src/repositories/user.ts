import { User } from '../models/users';
import { Auth } from '../types/api';

type UserFormatted = Omit<User, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

export class UserRepository {
  async listWhere(where: Record<any, any>): Promise<UserFormatted[]> {
    const users = await User.findAll({ where });
    return users.map(this.formatUser);
  }

  async getById(userId: string): Promise<UserFormatted | null> {
    const user = await User.findByPk(userId);
    return user ? this.formatUser(user) : null;
  }

  async createUser(userData: Auth['RegisterReqBody'] & { userId: string }): Promise<UserFormatted> {
    const user = await User.create(userData);
    return this.formatUser(user);
  }

  async getUserWithPassword(where: Record<any, any>): Promise<UserFormatted & { password: string } | undefined> {
    const user = await User.scope('withPassword').findOne({ where });
    if (!user) return undefined;

    return this.formatUser(user) as UserFormatted & { password: string };
  }

  async updateUser(userId: string, updateData: Partial<User>): Promise<UserFormatted | undefined> {
    const user = await User.findByPk(userId);
    if (!user) return undefined;

    return this.formatUser(await user.update(updateData));
  }

  async deleteUser(userId: string): Promise<void> {
    await User.destroy({ where: { userId } });
  }

  private formatUser(user: User): UserFormatted {
    return {
      ...user.dataValues,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
