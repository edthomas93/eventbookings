import { CreationOptional, DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';

export class User extends Model {
  declare userId: string;
  declare name: string;
  declare email: string;
  declare role: 'host' | 'attendee';
  private declare password: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

User.init(
  {
    userId: {
      type: DataTypes.UUID,
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
    password: {
      type: DataTypes.STRING,
      allowNull: false,
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
    defaultScope: {
      attributes: { exclude: ['password'] }, // Hide password by default
    },
    scopes: {
      withPassword: { attributes: undefined },
    },
  }
);

export default User;
