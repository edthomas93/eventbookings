import { Transaction } from 'sequelize';
import { Event } from '../models/events';

type EventFormatted = Omit<Event, 'startDateTime' | 'endDateTime' | 'createdAt' | 'updatedAt'> & {
  startDateTime: string;
  endDateTime: string;
  createdAt: string;
  updatedAt: string;
};

export class EventRepository {
  async createEvent(eventData: Partial<Event>): Promise<EventFormatted> {
    const event = await Event.create(eventData);
    return this.formatEvent(event);
  }

  async listEventsWhere(where: Record<any, any> = {}): Promise<EventFormatted[]> {
    const events = await Event.findAll({ where });
    return events.map(this.formatEvent);
  }

  async getEventById(eventId: string): Promise<EventFormatted | null> {
    const event = await Event.findByPk(eventId);
    return event ? this.formatEvent(event) : null;
  }

  async getEventByIdWithLock(eventId: string, transaction: Transaction): Promise<EventFormatted | null> {
    const event = await Event.findByPk(eventId, {
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    return event ? this.formatEvent(event) : null;
  }

  async updateEvent(eventId: string, updateBody: Partial<Event>, transaction?: Transaction): Promise<void> {
    await Event.update(updateBody, {
      where: { eventId },
      transaction,
    });
  }

  async deleteEvent(eventId: string): Promise<void> {
    await Event.destroy({ where: { eventId } });
  }

  private formatEvent(event: Event): EventFormatted {
    return {
      ...event.dataValues,
      startDateTime: event.startDateTime.toISOString(),
      endDateTime: event.endDateTime.toISOString(),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    };
  }
}
