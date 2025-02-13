import { CreationOptional, DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';

export class Event extends Model {
  declare eventId: string;
  declare title: string;
  declare description?: string;
  declare startDateTime: Date;
  declare endDateTime: Date;
  declare hostId: string;
  declare capacity: number;
  declare numberOfAttendees: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Event.init(
  {
    eventId: {
      type: DataTypes.UUID,
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
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDateTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    hostId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    numberOfAttendees: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Event',
    tableName: 'events',
    timestamps: true,
  }
);

export default Event;
