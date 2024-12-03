import {
  Table,
  Column,
  Model,
  DataType,
} from 'sequelize-typescript';
@Table
export class LessonType extends Model<LessonType> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;
}