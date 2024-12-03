import { Controller } from '../../libraries/Controller';
import { Request, Response, Router, NextFunction } from 'express';
import * as yup from 'yup'; // for everything
import * as moment from 'moment-timezone';
import { Op, where } from 'sequelize';
import { Studio } from '../../models/Studio';
import { Lesson } from '../../models/Lesson';
import { validateJWT, filterRoles } from '../../policies/General';
import { AssociationGetOptions } from 'sequelize-typescript';
import { validateYup, findAvailablePlaces } from '../../libraries/util';
import { Place } from '../../models/Place';
import { Instructor } from '../../models/Instructor';
import { Reserve } from '../../models/Reserve';
import { User } from '../../models/User';
import { log } from '../../libraries/Log';
import mailer from '../../services/EmailService';
import { Profile } from '../../models/Profile';
import { config } from '../../config/config';
import { LessonInstructors } from '../../models/LessonInstructors';
import { StorageFile } from '../../models/StorageFile';
import { BlockedPlace } from '../../models/BlockedPlace';

export class LessonController extends Controller {
  constructor() {
    super();
    this.name = 'lesson';
  }

  routes(): Router {
    this.router.get(
      '/',
      validateJWT('access'),
      (req: Request, res: Response, next: NextFunction) =>
        this.find(req, res, next),
    );

    this.router.get(
      '/next',
      validateJWT('access'),
      (req: Request, res: Response, next: NextFunction) =>
        this.findNext(req, res, next),
    );

    this.router.post(
      '/',
      validateJWT('access'),
      filterRoles(['admin']),
      (req: Request, res: Response, next: NextFunction) =>
        this.create(req, res, next),
    );

    this.router.get(
      '/:id',
      validateJWT('access'),
      this.loadLesson(),
      (req: Request, res: Response, next: NextFunction) =>
        this.findOne(req, res, next),
    );

    this.router.get(
      '/:id/assistants',
      validateJWT('access'),
      filterRoles(['admin']),
      this.loadLesson(),
      (req: Request, res: Response, next: NextFunction) =>
        this.assistants(req, res, next),
    );

    this.router.get(
      '/:id/available',
      this.loadLesson(),
      (req: Request, res: Response, next: NextFunction) =>
        this.available(req, res, next),
    );

    this.router.post(
      '/:id',
      validateJWT('access'),
      filterRoles(['admin']),
      this.loadLesson(),
      (req: Request, res: Response, next: NextFunction) =>
        this.update(req, res, next),
    );

    this.router.delete(
      '/:id',
      validateJWT('access'),
      filterRoles(['admin']),
      this.loadLesson(),
      (req: Request, res: Response, next: NextFunction) =>
        this.destroy(req, res, next),
    );

    return this.router;
  }
  private async sendEmailCancelation(
    user: User,
    date: string,
    hour: string,
    instructor: string,
  ): Promise<any> {
    const subject = '¡Información importante!';

    const info = await mailer.sendEmail({
      email: user.email,
      page: 'cancelation',
      locale: (user.profile ? user.profile.locale : 'es ') || 'es',
      context: {
        name: user.name,
        date,
        hour,
        instructor,
      },
      subject,
    });

    log.debug('Sending new reserve email to:', user.email, info);

    return info;
  }

  private async sendEmailLessonChanged(
    user: User,
    date: string,
    hour: string,
    newDate: string,
    newHour: string,
    instructor: string,
  ): Promise<any> {
    const subject = '¡Aviso de cambio en tu reservación!';

    const info = await mailer.sendEmail({
      email: user.email,
      page: 'changed_reserve',
      locale: user.profile.locale || 'es',
      context: {
        name: user.name,
        date,
        hour,
        newDate,
        newHour,
        instructor,
      },
      subject,
    });

    log.debug('Sending new reserve email to:', user.email, info);

    return info;
  }

  async findNext(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const studio: Studio = req.session.studio;

      const query: AssociationGetOptions = { where: {} };
      const schema = yup.object().shape({
        starts_at: yup.date().required(),
      });

      try {
        await validateYup(req.query, schema);
      } catch (err) {
        return Controller.badRequest(res, err.name, err.errors);
      }

      query.limit = 1;
      query.order = [
        ['starts_at', 'ASC']
      ];

      if (req.query.starts_at) {
        query.where['starts_at'] = { [Op.gte]: req.query.starts_at };
      }
      query.attributes = { exclude: ['meeting_url'] };

      const lessons: Lesson[] = (await studio.$get(
        'lessons',
        query,
      )) as Lesson[];

      let lessonsResult: any;

      lessonsResult = lessons.length > 0 ? lessons[0] : null;

      return Controller.ok(res, null, lessonsResult);
    } catch (err) {
      return next(err);
    }
  }

  async find(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const studio: Studio = req.session.studio;

      const query: AssociationGetOptions = { where: {} };

      if (req.session.logged && req.session.user.role === 'admin') {
        const schema = yup.object().shape({
          name: yup.string(),
          starts_at: yup.date(),
          ends_at: yup.date(),
        });

        try {
          await validateYup(req.query, schema);
        } catch (err) {
          return Controller.badRequest(res, err.name, err.errors);
        }

        if (req.query.name) {
          query.where['name'] = {
            [Op.iLike]: `%${req.body.name.trim()}%'`,
          };
        }

        if (req.query.starts_at) {
          query.where['starts_at'] = { [Op.gte]: req.query.starts_at };
        }

        if (req.query.ends_at) {
          query.where['ends_at'] = { [Op.lte]: req.query.ends_at };
        }

        query.include = [
          {
            model: Place,
            as: 'reserved_places',
            attributes: ['id'],
          },
          {
            model: Instructor,
            as: 'instructors',
            required: true,
            paranoid: true,
            attributes: ['id', 'name'],
            include: [{ model: StorageFile }]
          },
          {
            model: Studio,
            as: 'studio',
            attributes: ['id', 'name', 'slug']
          }
        ];

      } else {
        const schema = yup.object().shape({
          preview: yup.boolean().default(false),
        });

        try {
          await validateYup(req.query, schema);
        } catch (err) {
          return Controller.badRequest(res, err.name, err.errors);
        }

        let startOfWeek: Date, endOfWeek: Date;

        if (req.query.preview) {
          startOfWeek = moment()
            .utc()
            .utcOffset('-06:00')
            .startOf('day')
            .add(1, 'week')
            .toDate();
          endOfWeek = moment()
            .utc()
            .utcOffset('-06:00')
            .startOf('day')
            .add(2, 'week')
            .add(2, 'days')
            .toDate();
        } else {
          startOfWeek = moment()
            .utc()
            .utcOffset('-06:00')
            .startOf('day')
            .toDate();

          endOfWeek = moment()
            .utc()
            .utcOffset('-06:00')
            .endOf('day')
            .add(1, 'week')
            .subtract(1, 'day')
            .toDate();
        }

        query.where = { ends_at: { [Op.between]: [startOfWeek.toISOString(), endOfWeek.toISOString()] } };
        query.include = [
          {
            model: Place,
            as: 'reserved_places',
            attributes: ['id'],
          },
          {
            model: Instructor,
            as: 'instructors',
            required: true,
            paranoid: true,
            attributes: ['id', 'name'],
          },
          {
            model: Studio,
            as: 'studio',
            attributes: ['id', 'name', 'slug']
          }
        ];
        query.attributes = { exclude: ['meeting_url'] };
      }

      query.order = [['starts_at', 'ASC']];

      let lessons: Lesson[] = [];
      let places: Place[] = [];     
      
      if (studio) {
        lessons = (await studio.$get(
          'lessons',
          query,
        )) as Lesson[];
        places = (await studio.$get('places')) as Place[];
      } else {
        lessons = await Lesson.findAll(query);
      }

      const lessonsResult: any = lessons.map(async (lesson) => {
        const available = findAvailablePlaces(places, lesson.reserved_places);
        const locked = await BlockedPlace.count({ where: { lesson_id: lesson.id } });
        const plain: any = lesson.get({ plain: true });
        plain.locked=locked
        plain.available = available.length - locked;
        plain.available_places = available;
        delete plain.reserved_places;
        return plain;
      });

      const result = await Promise.all(lessonsResult);
      return Controller.ok(res, null, result);
    } catch (err) {
      return next(err);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      let lesson = req.session.lesson as Lesson;
      const instructors = lesson.instructors.map(instructor => instructor.getPlainWithAvatar());

      const plain_lesson: any = lesson.get({ plain: true });
      plain_lesson.instructors = instructors;
      if (req.session.user) {
        if (req.session.user.role !== 'admin') {
          delete plain_lesson.meeting_url;
        }
      } else {
        delete plain_lesson.meeting_url;
      }
      return Controller.ok(res, null, plain_lesson);
    } catch (err) {
      return next(err);
    }
  }

  async assistants(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const lesson = req.session.lesson as Lesson;
      const canceled = req.query.canceled || false;

      const reserves = await Reserve.findAll({
        where: { lesson_id: lesson.id, canceled: canceled },
        include: [{ model: User, as: 'user' }, Place]
      });

      return Controller.ok(res, null, reserves);
    } catch (err) {
      return next(err);
    }
  }

  async available(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const lesson = req.session.lesson as Lesson;

      const available = await lesson.getAvailablePlaces();
      const locked = await lesson.getLockedPlaces();
      const visible = await lesson.getVisiblePlaces();
      return Controller.ok(res, null, { available, locked, visible });
    } catch (err) {
      return next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = yup.object().shape({
        name: yup.string(),
        instructors: yup.array().of(yup.number()).min(1),
        special: yup.boolean().required(),
        community: yup.boolean().required(),
        meeting_url: yup.string().nullable(),
        description: yup.string().nullable(),
        starts_at: yup
          .date()
          .required()
          .min(
            moment()
              .startOf('hour')
              .add(1, 'h')
              .toDate(),
          ),
        duration: yup
          .number()
          .required()
          .positive(),
        unit: yup
          .string()
          .required(),
        lesson_type_id: yup.number().nullable(),
      });

      try {
        await validateYup(req.body, schema);
      } catch (err) {
        return Controller.badRequest(res, err.name, err.errors);
      }

      const starts_at = moment(req.body.starts_at);
      const ends_at = starts_at.clone().add(req.body.duration, req.body.unit);
      const studio: Studio = req.session.studio;

      /*
      We dont use the lesson overlap validation
      const lessons: Lesson[] = (await studio.$get('lessons', {
        attributes: ['id', 'name'],
        where: {
          ends_at: { [Op.between]: [starts_at.toDate(), ends_at.toDate()] },
        },
      })) as Lesson[];

      if (lessons.length > 0) {
        return Controller.unauthorized(res, 'hours_overlap', lessons);
      }
      */

      const lesson = (await studio.$create('lesson', {
        name: req.body.name,
        special: req.body.special,
        community: req.body.community,
        meeting_url: req.body.meeting_url,
        description: req.body.description,
        starts_at: starts_at.toDate(),
        ends_at: ends_at.toDate(),
        lesson_type_id: req.body.lesson_type_id
      })) as Lesson;

      for (let i in req.body.instructors) {
        await LessonInstructors.create({
          lesson_id: lesson.id,
          instructor_id: req.body.instructors[i]
        }
        );
      }

      return Controller.created(res, null, lesson);
    } catch (err) {
      return next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      let lesson = req.session.lesson as Lesson;
      const schema = yup.object().shape({
        name: yup.string(),
        instructors: yup.array().of(yup.number()).min(1),
        special: yup.boolean().required(),
        community: yup.boolean().required(),
        meeting_url: yup.string().nullable(),
        description: yup.string().nullable(),
        starts_at: yup
          .date()
          .required()
          .min(
            moment()
              .startOf('hour')
              .add(1, 'h')
              .toDate(),
          ),
        duration: yup
          .number()
          .required()
          .positive(),
        unit: yup
          .string()
          .required(),
        lesson_type_id: yup.number().nullable(),
      });

      try {
        await validateYup(req.body, schema);
      } catch (err) {
        return Controller.badRequest(res, err.name, err.errors);
      }

      const starts_at = moment(req.body.starts_at);
      const ends_at = starts_at.clone().add(req.body.duration, req.body.unit);
      const studio: Studio = req.session.studio;

      /*
      We dont use the lesson overlap validation anymore
      const lessons: Lesson[] = (await studio.$get('lessons', {
        attributes: ['id', 'name'],
        where: {
          starts_at: { [Op.between]: [starts_at.toDate(), ends_at.toDate()] },
        },
      })) as Lesson[];

      if (lessons.length > 0) {
        if (lessons.length === 1) {
          if (lessons[0].id !== lesson.id) {
            return Controller.unauthorized(res, 'hours_overlap', lessons)
          }
        } else {
          return Controller.unauthorized(res, 'hours_overlap', lessons)
        };
      }
      */

      const lessonInstructors = await LessonInstructors.findAll({ where: { lesson_id: lesson.id } });

      await lessonInstructors.map(lessonInstructor => lessonInstructor.destroy());

      const unique_users = [];
      let reserves = await Reserve.findAll({
        where: {
          lesson_id: lesson.id,
          canceled: false
        },
        include: [{ model: User, as: 'user', include: [Profile] }]
      });

      reserves = reserves.filter(reserve => {
        if (!unique_users.includes(reserve.user_id)) {
          unique_users.push(reserve.user_id);
          return true;
        }
        return false;
      });

      const date = moment(lesson.starts_at).utcOffset('-06:00');
      const newDate = moment(req.body.starts_at).utcOffset('-06:00');

      const instructorsNameArray: string[] = await Promise.all(req.body.instructors.map(async (id) => {
        const instructor = await Instructor.findOne({ where: { id: id } });
        return instructor.name;
      }));

      let instructorsName: string = instructorsNameArray.join(', ');

      reserves.forEach((reserve) => {
        this.sendEmailLessonChanged(
          reserve.user,
          date.format(config.date_format.date),
          date.format(config.date_format.time),
          newDate.format(config.date_format.date),
          newDate.format(config.date_format.time),
          instructorsName
        )
      });

      for (let i in req.body.instructors) {
        await LessonInstructors.create({
          lesson_id: lesson.id,
          instructor_id: req.body.instructors[i]
        }
        );
      }

      const updatedLesson = {
        name: req.body.name,
        starts_at: req.body.starts_at,
        ends_at: ends_at,
        special: req.body.special,
        community: req.body.community,
        meeting_url: req.body.meeting_url,
        description: req.body.description,
        lesson_type_id: req.body.lesson_type_id,
        studio_id: studio.id
      }

      lesson = await lesson.update(updatedLesson);
      return Controller.ok(res, null, lesson);
    } catch (error) {
      return next(error);
    }
  }

  async destroy(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const lesson = req.session.lesson as Lesson;

      const reserves = await Reserve.findAll({
        where: {
          lesson_id: lesson.id,
          canceled: false,
        },
        include: [{ model: User, as: 'user', include: [Profile] }]
      });

      const instructorsNameArray: string[] = await Promise.all(lesson.instructors.map(async (instructor) => {
        return instructor.name;
      }));

      let instructorsName: string = instructorsNameArray.join(', ');

      const date = moment(lesson.starts_at).utcOffset('-06:00');

      reserves.forEach((reserve) => {
        this.sendEmailCancelation(
          reserve.user,
          date.format(config.date_format.date),
          date.format(config.date_format.time),
          instructorsName
        )
      });

      await lesson.destroy();
      return Controller.noContent(res);
    } catch (error) {
      return next(error);
    }
  }

  private loadLesson() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const studio: Studio = req.session.studio;

        const query: AssociationGetOptions = { where: { id: req.params.id }, include: [{ model: Instructor, include: [{ model: StorageFile, as: 'avatar' }] }] };

        const lessons: Lesson[] = (await studio.$get(
          'lessons',
          query,
        )) as Lesson[];
        const lesson = lessons.pop();

        if (!lesson) {
          return Controller.notFound(res);
        }

        req.session.lesson = lesson;

        return next();
      } catch (error) {
        return next(error);
      }
    };
  }
}

const controller = new LessonController();
export default controller;


