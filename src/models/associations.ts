import { User } from './users';
import { Event } from './events';
import { Booking } from './bookings';

// A user can host multiple events
User.hasMany(Event, { foreignKey: 'hostId', as: 'hostedEvents' });
Event.belongsTo(User, { foreignKey: 'hostId', as: 'host' });

// A user can have multiple bookings
User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// An event can have multiple bookings
Event.hasMany(Booking, { foreignKey: 'eventId', as: 'eventBookings' });
Booking.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

export { User, Event, Booking };
