import { EventRepository } from '../../repositories/event';
import { Event } from '../../models/events';

export class ListEventsController {
  private eventRepository: EventRepository;

  constructor(eventRepository: EventRepository) {
    this.eventRepository = eventRepository;
  }

  async listEvents(): Promise<Event[]> {
    return this.eventRepository.listEventsWhere();
  }
}
