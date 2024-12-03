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
} from 'sequelize-typescript';
import { Studio } from './Studio';

@Table
export class Place extends Model<Place> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  location: string;

  @ForeignKey(() => Studio)
  @Column
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
