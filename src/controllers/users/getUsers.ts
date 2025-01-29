import { User } from '../../database';
import { ServerError } from '../../errors/errors';

const getUsers = async () => {
  try {
    return User.findAll();
  } catch (error) {
    throw new ServerError('An unexpected error occurred');
  }
};

export { getUsers };
