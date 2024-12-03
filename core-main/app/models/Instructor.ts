import {
  Table,
  Column,
  DataType,
  BelongsTo,
  Model,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { StorageFile } from './StorageFile';
import { isNullOrUndefined } from 'util';
import { Lesson } from './Lesson';
import { LessonInstructors } from './LessonInstructors';

@Table
export class Instructor extends Model<Instructor> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  experience: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @ForeignKey(() => StorageFile)
  @Column
  avatar_id: number;

  @BelongsTo(() => StorageFile)
  avatar: StorageFile;

  @BelongsToMany(() => Lesson, {
    through: {
      model: () => LessonInstructors,
    },
  })
  lessons: Lesson[];

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  getPlainWithAvatar() {
    const plain: any = this.get({ plain: true });
    if (!isNullOrUndefined(this.avatar)) {
      plain.avatar = this.avatar.getUrlFile();
    }

    return plain;
  }
}
