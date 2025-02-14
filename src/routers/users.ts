import { NextFunction, Request, Response, Router } from 'express';
import inputValidation from 'openapi-validator-middleware';

import { ListUsersController } from '../controllers/users/listUsers';
import { UserRepository } from '../repositories/user';
import { authMiddleware } from '../middleware/authentication';
import { UpdateUsersController } from '../controllers/users/updateUsers';

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

router.patch('/:userId', authMiddleware, inputValidation.validate, async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { body, params: { userId }, userDetails } = req;
    const controller = new UpdateUsersController(userDetails!, new UserRepository());
    const data = await controller.execute(userId, body);
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

export default router;