import {
  Table,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  Model,
  CreatedAt,
  UpdatedAt,
  DeletedAt
} from 'sequelize-typescript';
import { Lesson } from './Lesson';
import { Place } from './Place';
import { findActiveReserve } from '../libraries/util';


@Table
export class BlockedPlace extends Model<BlockedPlace> {

  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.UUID,
  })
  id: Number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  blocked_at: Date;
  
  @Column({
    type: DataType.BOOLEAN,
  })
  visible: Boolean;

  @ForeignKey(() => Place)
  @Column
  place_id: number;

  @BelongsTo(() => Place)
  place: Place;

  @ForeignKey(() => Lesson)
  @Column
  lesson_id: number;

  @BelongsTo(() => Lesson)
  lesson: Lesson;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

}
