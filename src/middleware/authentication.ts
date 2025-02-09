import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../services/auth';

type UserDetails = { userId: string; role: 'host' | 'attendee' };
type DecodedToken = UserDetails & { exp: number, iat: number };

export interface AuthenticatedRequest extends Request {
  userDetails?: UserDetails;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    if (!decoded.userId || !decoded.userId || !decoded.exp) {
      return res.status(401).json({ message: 'Unauthorized: Token is missing required attributes' });
    }

    req.userDetails = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
