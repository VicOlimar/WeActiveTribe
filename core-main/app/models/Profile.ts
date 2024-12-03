import {
  Table,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  Model,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import { User } from './User';

@Table
export class Profile extends Model<Profile> {
  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  time_zone: string;

  @Column({
    type: DataType.ENUM('en', 'es'),
    allowNull: true,
  })
  locale: 'en' | 'es' | string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  payment_key: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  birthdate: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  emergency_contact: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  emergency_contact_name: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  notifications: boolean;

  @ForeignKey(() => User)
  @Column
  user_id: number;

  @BelongsTo(() => User)
  user: User;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  toJSON() {
    const instance: any = super.toJSON();

    delete instance.created_at;
    delete instance.updated_at;
    delete instance.deleted_at;
    delete instance.id;

    return instance;
  }

  static LOCALES = ['es', 'en'];
}
