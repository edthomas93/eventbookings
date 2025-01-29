import { v7 as uuid } from 'uuid';

import { User } from '../../database';
import { Users } from '../../types/api';
import { ConflictError, ServerError } from '../../errors/errors';

const createUser = async (body: Users['PostReqBody']): Promise<Users['PostResBody']> => {
  try {
    // get request before for clearer error message
    const match = await User.findAll({ where: { email: body.email } });

    if (match.length) {
      throw new ConflictError('Email already in use');
    }

    const user = {
      ...body,
      id: uuid(),
    };
    return User.create(user);
  } catch (error) {
    if (error instanceof ConflictError) {
      throw error;
    }
    throw new ServerError('Failed to create new user');
  }
};

export { createUser };
