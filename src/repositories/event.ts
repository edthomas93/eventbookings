import { Transaction } from 'sequelize';
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

  async getEventByIdWithLock(eventId: string, transaction: Transaction): Promise<Event | null> {
    return Event.findByPk(eventId, {
      lock: transaction.LOCK.UPDATE,
      transaction,
    });
  }

  async updateEvent(eventId: string, updateBody: Partial<Event>, transaction?: Transaction): Promise<void> {
    await Event.update(updateBody, {
      where: { id: eventId },
      transaction,
    });
  }
}
