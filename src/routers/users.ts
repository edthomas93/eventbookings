import { NextFunction, Request, Response, Router } from 'express';

import { ListUsersController } from '../controllers/users/listUsers';
import { UserRepository } from '../repositories/user';
import { authMiddleware } from '../middleware/authentication';

const router: Router = Router();

router.get('/', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const controller = new ListUsersController(req.userDetails!, new UserRepository());
    const data = await controller.execute();
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

export default router;