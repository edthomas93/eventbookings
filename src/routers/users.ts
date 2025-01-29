import { Router } from 'express';
import { getUsers } from '../controllers/users/getUsers';
import { createUser } from '../controllers/users/createUser';

const router: Router = Router();

router.get('/', async (_, res, next): Promise<any> => {
  try {
    const data = await getUsers();
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next): Promise<any> => {
  try {
    const { body } = req;
    const data = await createUser(body);
    return res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

export default router;