import { BookingRepository } from '../../repositories/booking';
import { Bookings } from '../../types/api';
import { Role, UserDetails } from '../../types/auth';

export class ListBookingsController {
  private userId: string;
  private role: Role;
  private bookingRepository: BookingRepository;

  constructor(userDetails: UserDetails, bookingRepository: BookingRepository) {
    this.userId = userDetails.userId;
    this.role = userDetails.role;
    this.bookingRepository = bookingRepository;
  }

  async listBookings(): Promise<Bookings['ListResBody']> {
    if (this.role === 'attendee') {
      return this.bookingRepository.getBookingsForUser(this.userId);
    }
    return this.bookingRepository.getBookingsForHost(this.userId);
  }
}
