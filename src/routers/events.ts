import { Router, Request, Response, NextFunction } from 'express';
import inputValidation from 'openapi-validator-middleware';

import { CreateEventController } from '../controllers/events/createEvents';
// import { ListEventsController } from '../controllers/events/listEvents';
import { EventRepository } from '../repositories/event';
import { authMiddleware } from '../middleware/authentication';

const router = Router();

router.post('/', authMiddleware, inputValidation.validate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createEventController = new CreateEventController(req.userDetails!, new EventRepository());
    const event = await createEventController.createEvent(req.body);
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
});

// router.get('/', async (_: Request, res: Response, next: NextFunction) => {
//   try {
//     const listEventController = new ListEventsController(new EventRepository());
//     const events = await listEventController.listEvents();
//     res.status(200).json(events);
//   } catch (error) {
//     next(error);
//   }
// });

export default router;
