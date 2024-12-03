import {
  Table,
  Column,
  DataType,
  DeletedAt,
  BelongsTo,
  ForeignKey,
  Model,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Profile } from './Profile';

@Table
export class PaymentCustomer extends Model<PaymentCustomer> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  payment_key: string;

  @Column({
    type: DataType.ENUM('conekta', 'stripe'),
    allowNull: false,
  })
  payment_gateway: 'conekta' | 'stripe';

  @ForeignKey(() => Profile)
  @Column
  profile_id: number;

  @BelongsTo(() => Profile)
  profile: Profile;

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
    return instance;
  }
}