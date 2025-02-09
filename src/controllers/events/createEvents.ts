import { EventRepository } from '../../repositories/event';
import { Event } from '../../models/events';
import { v7 as uuid } from 'uuid';
import { Events } from '../../types/api';
import { Role, UserDetails } from '../../types/auth';
import { ForbiddenError } from '../../errors/errors';

export class CreateEventController {
  private userId: string;
  private role: Role;
  private eventRepository: EventRepository;

  constructor(userDetails: UserDetails, eventRepository: EventRepository) {
    this.userId = userDetails.userId;
    this.role = userDetails.role;
    this.eventRepository = eventRepository;
  }

  async createEvent(eventData: Events['PostReqBody']): Promise<Event> {
    if (this.role !== 'host') {
      throw new ForbiddenError('Only hosts can create events');
    }

    const event = {
      ...eventData,
      id: uuid(),
      hostId: this.userId,
      startDateTime: new Date(eventData.startDateTime),
      endDateTime: new Date(eventData.endDateTime),
    };

    return this.eventRepository.createEvent(event);
  }
}