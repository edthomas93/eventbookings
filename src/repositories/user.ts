import { User } from "../models/users";
import { Auth } from "../types/api";

export class UserRepository {
  async listWhere(where: Record<any, any>): Promise<User[]> {
    return User.findAll({ where });
  }

  async getById(userId: string): Promise<User | null> {
    return User.findByPk(userId);
  }

  async createUser(userData: Auth['RegisterReqBody'] & { id: string }): Promise<User> {
    return User.create(userData);
  }

  async getUserWithPassword(where: Record<any, any>): Promise<User | undefined> {
    const user = await User.scope('withPassword').findOne({ where });
    if (!user) return undefined;

    return user;
  }

  async updateUser(userId: string, updateData: Partial<User>): Promise<User | undefined> {
    const user = await User.findByPk(userId);
    if (!user) return undefined;

    return user.update(updateData);
  }

  async deleteUser(userId: string): Promise<void> {
    await User.destroy({ where: { id: userId } });
  }
}
