import { User } from '../../database';

const getUsers = async () => {
  return User.findAll();
};

export { getUsers };
