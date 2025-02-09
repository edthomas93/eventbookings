import { NextFunction, Request, Response, Router } from 'express';

import { ListUsersController } from '../controllers/users/listUsers';
import { UserRepository } from '../repositories/user';

const router: Router = Router();

router.get('/', async (_: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const controller = new ListUsersController(new UserRepository());
    const data = await controller.execute();
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

export default router;