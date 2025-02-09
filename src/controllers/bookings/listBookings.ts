import { BookingRepository } from '../../repositories/booking';
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

  // TODO: Fix return typing

  async listBookings() {
    if (this.role === 'attendee') {
      return this.bookingRepository.getBookingsForUser(this.userId);
    }
    return this.bookingRepository.getBookingsForHost(this.userId);
  }
}
