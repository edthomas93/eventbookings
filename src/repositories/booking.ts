import { Booking } from '../models/bookings';
import { Event } from '../models/events';
import { Bookings } from '../types/api';

export class BookingRepository {
  async createBooking(bookingData: { userId: string; eventId: string }): Promise<Booking> {
    return Booking.create(bookingData);
  }

  async findBooking(userId: string, eventId: string): Promise<Booking | null> {
    return Booking.findOne({
      where: {
        userId,
        eventId,
      },
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
