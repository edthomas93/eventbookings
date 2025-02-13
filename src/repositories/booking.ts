import { Transaction } from 'sequelize';
import { Booking } from '../models/bookings';
import { Event } from '../models/events';

type BookingFormatted = Omit<Booking, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

type EventFormatted = Omit<Event, 'startDateTime' | 'endDateTime' | 'createdAt' | 'updatedAt'> & {
  startDateTime: string;
  endDateTime: string;
  createdAt: string;
  updatedAt: string;
};

type BookingWithEvent = Booking & { event: Event };
type BookingWithEventFormatted = BookingFormatted & { event: EventFormatted };

export class BookingRepository {
  async createBooking(bookingData: { bookingId: string, userId: string; eventId: string }, transaction?: Transaction): Promise<BookingFormatted> {
    const booking = await Booking.create(bookingData, { transaction });
    return this.formatBooking(booking);
  }

  async findBooking(userId: string, eventId: string, transaction: Transaction): Promise<BookingFormatted | null> {
    const booking = await Booking.findOne({
      where: {
        userId,
        eventId,
      },
      transaction,
    });

    return booking ? this.formatBooking(booking) : null;
  }

  async getBookingsForUser(userId: string): Promise<BookingWithEventFormatted[]> {
    const bookings = await Booking.findAll({
      where: { userId },
      include: [{ model: Event, as: 'event' }],
    }) as BookingWithEvent[];

    return bookings.map(this.formatBookingWithEvent);
  }

  async getBookingsForHost(hostId: string): Promise<BookingWithEventFormatted[]> {
    const bookings = await Booking.findAll({
      include: [
        {
          model: Event,
          as: 'event',
          where: { hostId },
        },
      ],
    }) as BookingWithEvent[];

    return bookings.map(this.formatBookingWithEvent);
  }

  async deleteBooking(bookingId: string): Promise<void> {
    await Booking.destroy({ where: { bookingId } });
  }

  private formatBooking(booking: Booking): BookingFormatted {
    return {
      ...booking.dataValues,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    };
  }

  private formatBookingWithEvent(booking: BookingWithEvent): BookingWithEventFormatted {
    return {
      ...booking.dataValues,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
      event: {
        ...booking.event.dataValues,
        endDateTime: booking.event.endDateTime.toISOString(),
        startDateTime: booking.event.startDateTime.toISOString(),
        createdAt: booking.event.createdAt.toISOString(),
        updatedAt: booking.event.updatedAt.toISOString(),
      }
    };
  }
}
