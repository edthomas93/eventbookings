import { EventRepository } from '../../repositories/event';
import { v7 as uuid } from 'uuid';
import { Events } from '../../types/api';
import { Role, UserDetails } from '../../types/auth';
import { ForbiddenError, BadRequestError } from '../../errors/errors';

export class CreateEventController {
  private userId: string;
  private role: Role;
  private eventRepository: EventRepository;

  constructor(userDetails: UserDetails, eventRepository: EventRepository) {
    this.userId = userDetails.userId;
    this.role = userDetails.role;
    this.eventRepository = eventRepository;
  }

  // TODO: Add attribute for booking date (i.e. cannot necessarily book immediately)

  async createEvent(eventData: Events['PostReqBody']): Promise<Events['PostResBody']> {
    if (this.role !== 'host') {
      throw new ForbiddenError('Only hosts can create events');
    }

    const now = new Date();
    const startDateTime = new Date(eventData.startDateTime);
    const endDateTime = new Date(eventData.endDateTime);

    if (startDateTime < now) {
      throw new BadRequestError('Event cannot be scheduled in the past');
    }

    if (endDateTime <= startDateTime) {
      throw new BadRequestError('Event end time must be after the start time');
    }

    const duration = endDateTime.getTime() - startDateTime.getTime();
    const minDuration = 5 * 60 * 1000; // 5 minutes
    const maxDuration = 14 * 24 * 60 * 60 * 1000; // 2 weeks

    if (duration < minDuration || duration > maxDuration) {
      throw new BadRequestError('Event duration must be between 5 minutes and 2 weeks');
    }

    const event = {
      ...eventData,
      eventId: uuid(),
      hostId: this.userId,
      startDateTime: new Date(eventData.startDateTime),
      endDateTime: new Date(eventData.endDateTime),
    };

    return this.eventRepository.createEvent(event);
  }
}
