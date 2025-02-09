import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../services/auth';
import { UserDetails } from '../types/auth';

type DecodedToken = UserDetails & { exp: number; iat: number };

export interface AuthenticatedRequest extends Request {
  userDetails?: UserDetails;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    if (!decoded.userId || !decoded.role || !decoded.exp) {
      res.status(401).json({ message: 'Unauthorized: Token is missing required attributes' });
      return;
    }

    req.userDetails = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
    return;
  }
};
