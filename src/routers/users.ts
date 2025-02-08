import { NextFunction, Request, Response, Router } from 'express';
import inputValidation from 'openapi-validator-middleware';

import { GetUsersController } from '../controllers/users/getUsers';
import { CreateUserController } from '../controllers/users/createUser';
import { UserRepository } from '../repositories/user';

const router: Router = Router();

router.get('/', async (_: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const controller = new GetUsersController(new UserRepository());
    const data = await controller.execute();
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

router.post('/', inputValidation.validate, async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { body } = req;
    const controller = new CreateUserController(new UserRepository());
    const data = await controller.execute(body);
    return res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

export default router;