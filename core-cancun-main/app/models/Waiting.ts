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
  HasMany,
  AfterCreate,
  BeforeCreate,
} from 'sequelize-typescript';
import { User } from './User';
import { Lesson } from './Lesson';
import { Reserve } from './Reserve';

@Table
export class Waiting extends Model<Waiting> {
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  canceled: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  reserved_at: Date;

  @ForeignKey(() => Reserve)
  @Column
  reserve_id: number;

  @BelongsTo(() => Reserve)
  reserve: Reserve;

  @ForeignKey(() => Lesson)
  @Column
  lesson_id: number;

  @BelongsTo(() => Lesson)
  lesson: Lesson;

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
