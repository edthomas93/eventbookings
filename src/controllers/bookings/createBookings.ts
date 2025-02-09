import { BookingRepository } from '../../repositories/booking';
import { EventRepository } from '../../repositories/event';
import { Booking } from '../../models//bookings';
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

  async createBooking(bookingData: Bookings['PostReqBody']): Promise<Booking> {
    const { eventId } = bookingData;

    if (this.role !== 'attendee') {
      throw new ForbiddenError('Only attendees can book events');
    }

    const event = await this.eventRepository.getEventById(eventId);
    if (!event) {
      throw new NotFoundError('Event not found');
    }

    const existingBooking = await this.bookingRepository.findBooking(this.userId, eventId);

    if (existingBooking) {
      throw new ConflictError('User has already booked this event');
    }

    const currentDate = new Date();
    if (new Date(event.endDateTime) < currentDate) {
      throw new ConflictError('Cannot book an event that has already ended');
    }

    return this.bookingRepository.createBooking({
      userId: this.userId,
      eventId,
    });
  }
}
