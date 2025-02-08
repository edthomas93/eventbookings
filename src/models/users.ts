import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';

export class User extends Model {
  public id!: string;
  public name!: string;
  public email!: string;
  public role!: 'host' | 'attendee';
  public password!: string;
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
