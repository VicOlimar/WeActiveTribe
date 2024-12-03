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
  BelongsToMany,
  HasMany,
  BeforeDestroy,
} from 'sequelize-typescript';
import { Studio } from './Studio';
import { Place } from './Place';
import { Reserve } from './Reserve';
import { Waiting } from './Waiting';
import { Instructor } from './Instructor';
import { findAvailablePlaces, asyncForEach } from '../libraries/util';
import { User } from './User';
import { LessonInstructors } from './LessonInstructors';
import mailer from '../services/EmailService';
import { BlockedPlace } from './BlockedPlace';
import { Op } from 'sequelize';
import { LessonType } from './LessonType';
import generatePdf from '../libraries/generatePDF';
import { ClassList } from '../views/pdf/ClassList';
import * as moment from 'moment-timezone';


@Table
export class Lesson extends Model<Lesson> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  starts_at: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  ends_at: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  special: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  community: boolean;

  @Column({
    type: DataType.STRING,
    defaultValue: null,
  })
  meeting_url: string;

  @Column({
    type: DataType.STRING,
    defaultValue: null,
    allowNull: true,
  })
  description: string;
  
  @ForeignKey(() => LessonType)
  @Column({
    allowNull: true
  })
  lesson_type_id: number;

  @BelongsTo(() => LessonType)
  lesson_type: LessonType;

  @ForeignKey(() => Studio)
  @Column
  studio_id: number;

  @BelongsTo(() => Studio)
  studio: Studio;

  @BelongsToMany(() => Place, {
    through: {
      model: () => Reserve,
      scope: {
        canceled: false,
      },
    },
  })
  reserved_places: Place[];

  @BelongsToMany(() => Place, {
    through: {
      model: () => BlockedPlace
    }
  })
  blocked_places: Place[];

  @BelongsToMany(() => Place, {
    through: {
      model: () => BlockedPlace,
      scope: {
        visible: false
      }
    }
  })
  visible: Place[];

  @BelongsToMany(() => User, {
    through: {
      model: () => Reserve,
      scope: {
        canceled: false,
      },
    },
  })
  assistants: User[];

  @BelongsToMany(() => User, {
    through: {
      model: () => Reserve,
      scope: {
        canceled: true,
      },
    },
  })
  canceled_assistants: User[];

  @BelongsToMany(() => Instructor, {
    through: {
      model: () => LessonInstructors
    }
  })
  instructors: Instructor[];

  @HasMany(() => Waiting)
  waitings: Waiting[];

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  async getAvailablePlaces() {
    const studio = (await this.$get('studio', {
      include: [{ model: Place, as: 'places' }],
    })) as Studio;
    const reserved_places = (await this.$get('reserved_places')) as Place[];
    return findAvailablePlaces(studio.places, reserved_places);
  }

  async sendInfoEmail() {
    const reserves = await Reserve.findAll({ where: { lesson_id: this.id }, include: [{ model: User, as: 'user' }] });
    const subject = '¡Información sobre tu reserva!';

    reserves.forEach(async (reserve) => {
      await mailer.sendEmail({
        email: reserve.user.email,
        page: 'info_lesson',
        locale: 'es',
        context: {
          name: reserve.user.name,
        },
        subject,
      });
    });
  }

  async classReminder() {
    
    const studio = (await this.$get('studio', {
      include: [{ model: Place, as: 'places' }],
    })) as Studio;
    const reserves = await Reserve.findAll({
      where: { lesson_id: this.id, canceled: false },
      include: [{ model: User, as: 'user' }, Place]
    });
    const objectReserves = {};

    reserves.forEach(reserve => {  
      objectReserves[reserve.place_id] = {name: reserve.user.name, email: reserve.user.email};
    });

    const LockedPlaces = await this.getLockedPlaces();
    const objectLockedPlace = {};

    LockedPlaces.forEach((lockedPlace: any) => {
       objectLockedPlace[lockedPlace.location] = true;
    });
    
    let listStudent = [];

    studio.places.forEach(studioPlace => {
      if(objectReserves.hasOwnProperty(studioPlace.id)) {
        listStudent.push({ reserved: true, location: studioPlace.location, userName: objectReserves[studioPlace.id].name, userEmail: objectReserves[studioPlace.id].email});
      }
      else {
        if(!objectLockedPlace.hasOwnProperty(studioPlace.location)) {
          listStudent.push({ reserved: false, location: studioPlace.location,});
        }
      }
    });
    
    const subject = '¡Tu clase esta por comenzar!';
    
    let time = moment(this.starts_at).utcOffset('-05:00').format('LT');
    let day = moment().locale('es-mex').format('LL');
    let studioName = studio.name;

    const pdf = await generatePdf(ClassList(listStudent, time, day, studioName, this.instructors));

    this.instructors.forEach(async (instructor) => {
      await mailer.sendEmail({
        email: instructor.email,
        page: 'reminder',
        locale: 'es',
        context: {
          name: instructor.name,
          studio: studioName,
          time: time
        },
        subject,
        pdf
      });
    });
    
  }

  async getLockedPlaces() {
    const places_locked_permanent_ids = process.env.BLOCKED_PLACES ? process.env.BLOCKED_PLACES.split(',') : [] || [];
    const locked_places = (await this.$get('blocked_places')) as Place[];
    const visible_place = (await this.$get('visible')) as Place[];

    visible_place.map((place, index) => {let p = place.location; console.log(p, index)})
    const places_locked_permanent = await Place.findAll({
      where: {
        id: {
          [Op.in]: places_locked_permanent_ids
        }
      }
    });
    
    return locked_places.concat(places_locked_permanent);
  }

  async getVisiblePlaces() {
    const visible_places = (await this.$get('visible')) as Place[];
     return visible_places;
  }

  @BeforeDestroy
  static async removeWaitingListAndReserves(lesson: Lesson, options: any) {
    await Waiting.destroy({ where: { lesson_id: lesson.id } });
    const reserves = await Reserve.findAll({ where: { lesson_id: lesson.id } });
    await asyncForEach(reserves, async (reserve) => {
      await Reserve.updateCredit(reserve);
      await reserve.destroy();
    });
    return lesson;
  }
}


