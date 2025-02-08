import { Router, Request, Response, NextFunction } from 'express';
import inputValidation from 'openapi-validator-middleware';

import { RegisterController } from '../controllers/auth/register';
import { UserRepository } from '../repositories/user';
import { AuthService } from '../services/auth';
import { LoginController } from '../controllers/auth/login';

const router = Router();

router.post('/register', inputValidation.validate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const registerController = new RegisterController(new UserRepository(), new AuthService());
    const result = await registerController.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/login', inputValidation.validate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const loginController = new LoginController(new UserRepository(), new AuthService());
    const result = await loginController.login(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
