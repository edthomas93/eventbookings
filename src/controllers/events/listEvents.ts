import { EventRepository } from '../../repositories/event';
import { Event } from '../../models/events';

export class ListEventsController {
  private eventRepository: EventRepository;

  constructor(eventRepository: EventRepository) {
    this.eventRepository = eventRepository;
  }

  async listEvents(): Promise<Event[]> {
    // TODO: As a host list only your events
    return this.eventRepository.listEventsWhere();
  }
}
