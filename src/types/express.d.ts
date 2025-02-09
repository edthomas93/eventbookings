import * as express from 'express';
import { UserDetails } from './auth';

declare module 'express-serve-static-core' {
  interface Request {
    userDetails?: UserDetails;
  }
}
