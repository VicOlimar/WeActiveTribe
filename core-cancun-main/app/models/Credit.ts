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
  Sequelize,
} from 'sequelize-typescript';
import { User } from './User';
import { Charge } from './Charge';
import { LessonType } from './LessonType';
import { Studio } from './Studio';

@Table
export class Credit extends Model<Credit> {
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  used: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  canceled: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expires_at: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  paused: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  validity: number;

  @ForeignKey(() => LessonType)
  @Column
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

  @ForeignKey(() => Charge)
  @Column
  charge_id: number;

  @BelongsTo(() => Charge)
  charge: Charge;

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
}
