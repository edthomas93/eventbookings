import { Router, Request, Response, NextFunction } from 'express';
import inputValidation from 'openapi-validator-middleware';

import { EventRepository } from '../repositories/event';
import { authMiddleware } from '../middleware/authentication';
import { CreateBookingController } from '../controllers/bookings/createBookings';
import { ListBookingsController } from '../controllers/bookings/listBookings';
import { BookingRepository } from '../repositories/booking';

const router = Router();

router.post('/', authMiddleware, inputValidation.validate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const controller = new CreateBookingController(req.userDetails!, new BookingRepository(), new EventRepository());
    const event = await controller.createBooking(req.body);
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
});

router.get('/', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const controller = new ListBookingsController(req.userDetails!, new BookingRepository());
    const events = await controller.listBookings();
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
});

export default router;
