import { Response } from 'express';
import jwt from 'jsonwebtoken';

import { authMiddleware, AuthenticatedRequest } from '../../src/middleware/authentication';
import { JWT_SECRET } from '../../src/services/auth';

describe('Auth Middleware', () => {
  let request: Partial<AuthenticatedRequest>;
  let response: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    request = {};
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  const generateToken = (payload: object, expiresIn?: string | number) => {
    return jwt.sign(payload, JWT_SECRET, expiresIn ? { expiresIn: '1h' } : {});
  };

  test('Should allow request with valid token and attach user to req', () => {
    const validToken = generateToken({ userId: '123', role: 'host' }, '1h');

    request.headers = { authorization: `Bearer ${validToken}` };
    authMiddleware(request as AuthenticatedRequest, response as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(request.userDetails?.userId).toEqual('123');
    expect(request.userDetails?.role).toEqual('host');
  });

  test('Should reject request with no token', () => {
    request.headers = {};

    authMiddleware(request as AuthenticatedRequest, response as Response, mockNext);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({ message: 'Unauthorized: No token provided' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('Should reject request with invalid token', () => {
    request.headers = { authorization: 'Bearer invalidToken123' };

    authMiddleware(request as AuthenticatedRequest, response as Response, mockNext);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({ message: 'Unauthorized: Invalid token' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('Should reject request with malformed Bearer token', () => {
    request.headers = { authorization: 'InvalidHeader' };

    authMiddleware(request as AuthenticatedRequest, response as Response, mockNext);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({ message: 'Unauthorized: No token provided' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('Should reject request if token is missing required attributes', () => {
    const badToken = generateToken({ role: 'host' }, '1h');

    request.headers = { authorization: `Bearer ${badToken}` };
    authMiddleware(request as AuthenticatedRequest, response as Response, mockNext);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({ message: 'Unauthorized: Token is missing required attributes' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  test('Should reject request if token does not have an expiration time', () => {
    const noExpiryToken = generateToken({ userId: '123', role: 'attendee' });

    request.headers = { authorization: `Bearer ${noExpiryToken}` };
    authMiddleware(request as AuthenticatedRequest, response as Response, mockNext);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({ message: 'Unauthorized: Token is missing required attributes' });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
