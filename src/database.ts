import { Sequelize, DataTypes, Model, InferAttributes, InferCreationAttributes } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db/event_booking.sqlite',
});

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: string;
  declare name: string;
  declare email: string;
  declare role: 'host' | 'attendee';
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    role: {
      type: DataTypes.ENUM('host', 'attendee'),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  }
);

class Event extends Model<InferAttributes<Event>, InferCreationAttributes<Event>> {
  declare id: string;
  declare title: string;
  declare description?: string;
  declare startDateTime: Date;
  declare endDateTime: Date;
  declare hostId: string;
}

Event.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    startDateTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endDateTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    hostId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Event',
    tableName: 'events',
  }
);

class Booking extends Model<InferAttributes<Booking>, InferCreationAttributes<Booking>> {
  declare id: string;
  declare userId: string;
  declare eventId: string;
}

Booking.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    eventId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Booking',
    tableName: 'bookings',
  }
);

// A user can host multiple events
User.hasMany(Event, { foreignKey: 'hostId', as: 'hostedEvents' });
Event.belongsTo(User, { foreignKey: 'hostId', as: 'host' });

// A user can have multiple bookings
User.hasMany(Booking, { foreignKey: 'user_id', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// An event can have multiple bookings
Event.hasMany(Booking, { foreignKey: 'event_id', as: 'eventBookings' });
Booking.belongsTo(Event, { foreignKey: 'event_id', as: 'event' });

export { sequelize, User, Event, Booking };