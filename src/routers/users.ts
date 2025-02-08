import { NextFunction, Request, Response, Router } from 'express';

import { GetUsersController } from '../controllers/users/getUsers';
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

export default router;