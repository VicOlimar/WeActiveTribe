import {
  Table,
  Column,
  DataType,
  Model,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  BelongsToMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { LessonType } from './LessonType';
import { Studio } from './Studio';

@Table
export class Plan extends Model<Plan> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  credits: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  expires_numbers: number;

  @Column({
    type: DataType.ENUM('years', 'months', 'days'),
    allowNull: false,
    defaultValue: 'months',
  })
  expires_unit: 'years' | 'months' | 'days';

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  special: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  active: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  active_mobile: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  new_users_only: boolean;

  @Column({
    type: DataType.ENUM('classic', 'online'),
    allowNull: false,
    defaultValue: 'classic',
  })
  credit_type: 'classic' | 'online';

  @ForeignKey(() => LessonType)
  @Column({
    allowNull: true
  })
  lesson_type_id: number;

  @BelongsTo(() => LessonType)
  lesson_type: LessonType;

  @ForeignKey(() => Studio)
  @Column({
    allowNull: true
  })
  studio_id: number;

  @BelongsTo(() => Studio)
  studio: Studio;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
