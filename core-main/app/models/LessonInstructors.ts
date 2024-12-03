import {
    Table,
    Column,
    DataType,
    BelongsTo,
    Model,
    ForeignKey,
    BeforeBulkCreate,
    BeforeBulkUpdate,
    BeforeCreate,
    BeforeUpdate,
    BeforeValidate,
    AfterCreate,
    AfterUpdate,
    HasMany
} from 'sequelize-typescript';
import { Instructor } from './Instructor';
import { Lesson } from './Lesson';
@Table
export class LessonInstructors extends Model<LessonInstructors> {
    @ForeignKey(() => Lesson)
    @Column
    lesson_id: number;

    @BelongsTo(() => Lesson)
    lesson: Lesson;

    @ForeignKey(() => Instructor)
    @Column
    instructor_id: number;

    @BelongsTo(() => Instructor)
    instructor: Instructor;
}