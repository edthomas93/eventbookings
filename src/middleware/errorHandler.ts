import { NextFunction, Request, Response } from 'express';
import { InputValidationError } from 'openapi-validator-middleware';

import { HttpError } from '../errors/errors';

const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof InputValidationError) {
    console.error("OpenAPI Validation Error:", err.errors);
    res.status(400).json({
      status: 400,
      error: "Validation failed",
      details: err.errors.map((e: any) => ({
        path: e.path,
        message: e.message,
        location: e.location,
      })),
    });
  } else if (err instanceof HttpError) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    console.error("Unexpected Server Error:", err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default errorHandler;
