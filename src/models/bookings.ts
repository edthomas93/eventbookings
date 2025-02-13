import { DataTypes, Model, CreationOptional } from 'sequelize';
import { sequelize } from '../database';

export class Booking extends Model {
  declare bookingId: string;
  declare userId: string;
  declare eventId: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Booking.init(
  {
    bookingId: {
      type: DataTypes.UUID,
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
    timestamps: true,
  }
);

export default Booking;
