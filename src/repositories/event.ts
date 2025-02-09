import { Event } from '../models/events';

export class EventRepository {
  async createEvent(eventData: Partial<Event>): Promise<Event> {
    return Event.create(eventData);
  }

  async listEventsWhere(where: Record<any, any> = {}): Promise<Event[]> {
    return Event.findAll({ where });
  }

  async getEventById(eventId: string): Promise<Event | null> {
    return Event.findByPk(eventId);
  }
}
