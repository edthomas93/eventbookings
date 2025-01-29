import { HttpError } from '../errors/errors';

const errorHandler = (err: Error, req: any, res: any, next: any) => {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default errorHandler;