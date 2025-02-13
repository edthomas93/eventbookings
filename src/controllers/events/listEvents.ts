import { EventRepository } from '../../repositories/event';
import { Events } from '../../types/api';

export class ListEventsController {
  private eventRepository: EventRepository;

  constructor(eventRepository: EventRepository) {
    this.eventRepository = eventRepository;
  }

  async listEvents(): Promise<Events['ListResBody']> {
    // TODO: As a host list only your events
    return this.eventRepository.listEventsWhere();
  }
}
