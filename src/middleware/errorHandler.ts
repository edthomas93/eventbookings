import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/errors';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default errorHandler;
