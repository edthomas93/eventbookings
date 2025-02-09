import { Transaction } from 'sequelize';
import { Booking } from '../models/bookings';
import { Event } from '../models/events';

export class BookingRepository {
  async createBooking(bookingData: { userId: string; eventId: string }, transaction?: Transaction): Promise<Booking> {
    return Booking.create(bookingData, { transaction });
  }

  async findBooking(userId: string, eventId: string, transaction: Transaction): Promise<Booking | null> {
    return Booking.findOne({
      where: {
        userId,
        eventId,
      },
      transaction,
    });
  }

  async getBookingsForUser(userId: string): Promise<(Booking & { event: Event })[]> {
    return Booking.findAll({
      where: { userId },
      include: [{ model: Event, as: 'event' }],
    }) as Promise<(Booking & { event: Event })[]>;
  }

  async getBookingsForHost(hostId: string): Promise<(Booking & { event: Event })[]> {
    return Booking.findAll({
      include: [
        {
          model: Event,
          as: 'event',
          where: {
            hostId,
          },
        },
      ],
    }) as Promise<(Booking & { event: Event })[]>;
  }

  async deleteBooking(bookingId: string): Promise<void> {
    await Booking.destroy({ where: { id: bookingId } });
  }
}
