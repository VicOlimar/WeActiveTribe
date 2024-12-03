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
  BeforeCreate,
  AfterUpdate,
  BeforeUpdate,
} from 'sequelize-typescript';
import { Lesson } from './Lesson';
import { Place } from './Place';
import { User } from './User';
import { Credit } from './Credit';
import { findActiveReserve, useACredit, findLockedPlace, validateCreditsType, validateStudioCredits } from '../libraries/util';
import * as moment from 'moment-timezone';
import { Waiting } from './Waiting';
import { isNullOrUndefined } from 'util';
import { Studio } from './Studio';
import { Instructor } from './Instructor';
import { config } from '../config/config';
import { log } from '../libraries/Log';
import TwilioService from '../services/TwilioService';
import { Profile } from './Profile';
import { OnlineCredit } from './OnlineCredit';
import { LessonType } from './LessonType';

@Table
export class Reserve extends Model<Reserve> {
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  canceled: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  reserved_at: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  community: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  canceled_at: Date;

  @ForeignKey(() => Place)
  @Column
  place_id: number;

  @BelongsTo(() => Place)
  place: Place;

  @ForeignKey(() => User)
  @Column({
    allowNull: true
  })
  canceled_by_user_id: number;

  @BelongsTo(() => User, {
    as: 'canceled_by_user',
    foreignKey: 'canceled_by_user_id'
  })
  canceled_by_user: User;

  @ForeignKey(() => Lesson)
  @Column
  lesson_id: number;

  @BelongsTo(() => Lesson)
  lesson: Lesson;

  @ForeignKey(() => Credit)
  @Column({
    allowNull: true
  })
  credit_id: number;

  @BelongsTo(() => Credit)
  credit: Credit;

  @ForeignKey(() => OnlineCredit)
  @Column({
    allowNull: true
  })
  online_credit_id: number;

  @BelongsTo(() => OnlineCredit)
  online_credit: OnlineCredit;

  @ForeignKey(() => User)
  @Column
  user_id: number;

  @BelongsTo(() => User, {
    as: 'user',
    foreignKey: 'user_id'
  })
  user: User;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BeforeCreate
  static async checkIfAvailable(reserve: Reserve, options: any) {
    const defaultCreditsByClass = 1;
    await findActiveReserve(reserve.lesson_id, reserve.place_id);
    await findLockedPlace(reserve.lesson_id, reserve.place_id);
    const lesson = await Lesson.findByPk(reserve.lesson_id, { include: [Studio, LessonType] });
    const is_online = lesson.studio.slug === 'online';

    if (!lesson.community) {
      if (lesson.lesson_type) {
        await validateCreditsType(lesson.lesson_type_id, reserve.user_id, defaultCreditsByClass, is_online);
      }

      if (lesson.studio_id && !lesson.lesson_type) {
        await validateStudioCredits(lesson.studio_id, reserve.user_id, defaultCreditsByClass);
      }

      const credit = await useACredit(reserve.user_id, is_online ? 'online' : 'classic', lesson.lesson_type_id, lesson.studio_id);
      if (credit) {
        if (is_online) {
          reserve.online_credit_id = credit.id;
        } else {
          reserve.credit_id = credit.id;
        }
      }
    } else {
      reserve.community = true;
    }
    reserve.reserved_at = new Date();
  }

  @AfterUpdate
  static async checkWaitingList(reserve: Reserve, options: any) {
    const lesson = (await reserve.$get('lesson', { include: [Studio, Instructor] })) as Lesson;
    const place = (await reserve.$get('place')) as Place;

    const waitings = (await lesson.$get('waitings', {
      order: [['date', 'ASC']],
      where: {
        canceled: false,
        reserve_id: null,
      },
      include: [{ model: User, include: [Profile] }, Lesson]
    })) as Waiting[];

    const max_time_hour_to_cancel = 21 // 9 pm of the day
    const max_time_difference = 13 // 13 hours from 9 pm to 10 am
    const now = moment().utcOffset('-06:00');
    const lesson_date = moment(lesson.starts_at).utcOffset('-06:00');
    const hours_difference = Math.abs(now.diff(lesson_date, 'hours'));

    if (now.hours() >= max_time_hour_to_cancel && hours_difference <= max_time_difference) {
      if (lesson_date.hours() <= 10) { // 10 AM
        return
      }
    }

    if (waitings.length) {
      let waiting: Waiting,
        waiting_reserve: Reserve,
        available = true;

      while (available) {
        try {
          waiting = waitings.shift();
          waiting_reserve = new Reserve();
          waiting_reserve.canceled = false;
          waiting_reserve.lesson_id = lesson.id;
          waiting_reserve.user_id = waiting.user_id;
          waiting_reserve.place_id = place.id;
          waiting_reserve.reserved_at = new Date();
          waiting_reserve = await waiting_reserve.save();
          available = false;

          const instructorsNameArray: string[] = await Promise.all(lesson.instructors.map(async (instructor) => {
            return instructor.name;
          }));

          let instructorsName: string = instructorsNameArray.join(', ');

          // Send reservation email
          const date = moment(waiting.lesson.starts_at).utcOffset('-06:00');
          try {
            await waiting.user.sendEmailReserve(
              true,
              date.format(config.date_format.date),
              date.format(config.date_format.time),
              lesson.studio,
              place.location,
              instructorsName,
              lesson.meeting_url
            );
          } catch {
            log.info(`Email ${waiting.user.email} de envio de waiting list fallido.`);
          }

          try {
            const phone = waiting.user!.profile!.phone;
            if (!phone) {
              throw new Error('El usuario no cuenta con un número de teléfono.')
            }
            const msg = `WE: Tienes el lugar ${place.location} de la clase de ${date.format(config.date_format.time)} el día ${date.format(config.date_format.date)}. Nos vemos pronto!`;
            await TwilioService.sendTo(phone, msg);
          } catch {
            log.info(`SMS ${waiting.user.email} de envio de waiting list fallido.`)
          }
        } catch (err) {
          const msg = err.message || err.name || 'Desconocido'
          log.error(`Reservación de ${waiting.user.email}. Razón: ${msg}`)
          if (waitings.length == 0) {
            waiting_reserve = null;
            available = false;
          }
        }
      }

      if (!isNullOrUndefined(waiting_reserve)) {
        try {
          waiting.reserved_at = waiting_reserve.reserved_at;
          waiting.reserve_id = waiting_reserve.id;
          waiting = await waiting.save();
        } catch (err) {
          // we don't care if this fails
        }
      }
    }
  }

  @BeforeUpdate
  static async restoreCredit(reserve: Reserve, options: any) {
    if (reserve.changed('canceled') && reserve.getDataValue('canceled')) {
      await this.updateCredit(reserve);
    }

    return reserve;
  }

  static async updateCredit(reserve: Reserve) {
    const lesson = (await reserve.$get('lesson', { include: [Studio, Instructor], paranoid: false })) as Lesson;
    if (!lesson.community) {
      let credit;
      if (lesson.studio.slug === 'online') {
        console.log(lesson.studio.slug)
        console.log(reserve.online_credit_id);
        credit = await OnlineCredit.findOne({ where: { id: reserve.online_credit_id } });
      } else {
        console.log(lesson.studio.slug)
        credit = await Credit.findOne({ where: { id: reserve.credit_id } });
      }
      credit.used = false;
      credit = await credit.save();
    }
    return reserve;
  }
}
