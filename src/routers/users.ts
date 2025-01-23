import { Router } from 'express';
import { getUsers } from '../controllers/users/getUsers';

const router: Router = Router();

router.get('/', async (_, res, next): Promise<any> => {
  try {
    const users = await getUsers();
    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

export default router;