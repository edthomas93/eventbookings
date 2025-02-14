import { v7 as uuid } from 'uuid';
import { BookingRepository } from '../../repositories/booking';
import { EventRepository } from '../../repositories/event';
import { sequelize } from '../../database';
import { Bookings } from '../../types/api';
import { ForbiddenError, NotFoundError, ConflictError } from '../../errors/errors';
import { Role, UserDetails } from '../../types/auth';

export class CreateBookingController {
  private userId: string;
  private role: Role;
  private bookingRepository: BookingRepository;
  private eventRepository: EventRepository;

  constructor(
    userDetails: UserDetails,
    bookingRepository: BookingRepository,
    eventRepository: EventRepository
  ) {
    this.userId = userDetails.userId;
    this.role = userDetails.role;
    this.bookingRepository = bookingRepository;
    this.eventRepository = eventRepository;
  }

  async createBooking(bookingData: Bookings['PostReqBody']): Promise<Bookings['PostResBody']> {
    const { eventId } = bookingData;

    if (this.role !== 'attendee') {
      throw new ForbiddenError('Only attendees can book events');
    }

    // Use transaction to prevent race conditions if multiple users attempt to book at the same time
    return sequelize.transaction(async (transaction) => {
      const event = await this.eventRepository.getEventByIdWithLock(eventId, transaction);
      if (!event) {
        throw new NotFoundError('Event not found');
      }

      const existingBooking = await this.bookingRepository.findBooking(this.userId, eventId, transaction);
      if (existingBooking) {
        throw new ConflictError('User has already booked this event');
      }

      const currentDate = new Date();
      if (new Date(event.endDateTime) < currentDate) {
        throw new ConflictError('Cannot book an event that has already ended');
      }

      if (event.numberOfAttendees >= event.capacity) {
        throw new ConflictError('Event capacity exceeded');
      }

      await this.eventRepository.updateEvent(eventId, {
        numberOfAttendees: event.numberOfAttendees + 1,
      }, transaction);

      return this.bookingRepository.createBooking({ bookingId: uuid(), userId: this.userId, eventId }, transaction);
    });
  }
}
