import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';

export class User extends Model {
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
    timestamps: true, // Enables createdAt and updatedAt
  }
);
