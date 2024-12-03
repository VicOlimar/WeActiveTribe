import {
  Table,
  Column,
  DataType,
  Model,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  BelongsTo,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { Charge } from './Charge';

@Table
export class Discount extends Model<Discount> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  code: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  total_uses: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  active: boolean;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  discount: number;

  @Column({
    type: DataType.ENUM('percentage', 'amount'),
    allowNull: false,
    defaultValue: 'percentage',
  })
  type: 'percentage' | 'amount';

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  expires_after: Date;

  @HasMany(() => Charge)
  charges: Charge[];

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
