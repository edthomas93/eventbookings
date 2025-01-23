import { Router } from 'express';

const router: Router = Router();

router.get('/', async (_, res, next): Promise<any> => {
  try {
    return res.status(200).json('Test');
  } catch (err) {
    next(err);
  }
});

export default router;