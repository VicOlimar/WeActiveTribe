import { Controller } from '../../libraries/Controller';
import { Request, Response, Router } from 'express';
import { validateJWT, onlyLogged } from '../../policies/General';
import * as yup from 'yup';
import { Reserve } from '../../models/Reserve';
import { Lesson } from '../../models/Lesson';
import { Op, FindAndCountOptions, FindOptions, Sequelize, Includeable, WhereOptions, WhereValue } from 'sequelize';
import { Place } from '../../models/Place';
import { User } from '../../models/User';
import { findActiveReserve, validateYup, perPage } from '../../libraries/util';
import { NextFunction } from 'connect';
import { log } from '../../libraries/Log';
import mailer from '../../services/EmailService';
import * as moment from 'moment';
import { Studio } from '../../models/Studio';
import { Instructor } from '../../models/Instructor';
import { config } from '../../config/config';

export class ReserveController extends Controller {
  constructor() {
    super();
    this.name = 'reserve';
  }

  routes(): Router {
    this.router.get(
      '/',
      validateJWT('access'),
      onlyLogged(),
      (req: Request, res: Response, next: NextFunction) =>
        this.find(req, res, next),
    );

    this.router.get(
      '/:id',
      validateJWT('access'),
      onlyLogged(),
      this.loadReserve(),
      (req: Request, res: Response, next: NextFunction) =>
        this.findOne(req, res, next),
    );

    this.router.post(
      '/',
      validateJWT('access'),
      onlyLogged(),
      (req: Request, res: Response, next: NextFunction) =>
        this.create(req, res, next),
    );

    this.router.delete(
      '/:id',
      validateJWT('access'),
      onlyLogged(),
      this.loadReserve(),
      (req: Request, res: Response, next: NextFunction) =>
        this.cancel(req, res, next),
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

  async find(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {

      const user: User = req.session.user;
      const { limit, offset } = perPage(req.query.per_page, req.query.page);

      const query: FindAndCountOptions = {
        limit,
        offset,
        order: [
          [{ model: Lesson, as: 'lesson' }, 'starts_at', 'DESC'],
        ],
        include: [
          {
            model: Place,
            attributes: ['location'],
            include: [
              { model: Studio, attributes: ['name'] }
            ]
          }
        ],
        attributes: ['id', 'canceled', 'reserved_at', 'place_id', 'lesson_id', 'credit_id', 'user_id'],
        subQuery: false,
      };

      const queryCount: FindAndCountOptions = {
        limit,
        offset,
        include: []
      }

      if (user.role === 'admin' && req.query.user_id) {
        query.where = { user_id: req.query.user_id };
        queryCount.where = { user_id: req.query.user_id };
      }

      if (user.role === 'user') {
        const past = (req.query.past === 'true'); // The validation is because the query param is handled like a string in express
        const starts_at: WhereValue = { [past ? Op.lt : Op.gte]: new Date() };

        query.where = { user_id: user.id, canceled: false };
        queryCount.where = { user_id: user.id, canceled: false };

        query.include.push({
          model: Lesson,
          where: { starts_at },
          duplicating: true, // This is for avoid a Sequelize error related with the from clausule in query
        });

        queryCount.include.push({
          model: Lesson,
          where: { starts_at }
        });
      } else {
        query.include.push({
          model: Lesson,
          include: [
            { model: Studio },
            { model: Instructor }
          ]
        });

        queryCount.include.push({
          model: Lesson
        });
      }

      const count = await Reserve.count(queryCount);
      let reserves = await Reserve.findAll(query);
      reserves = await Promise.all(reserves.map(async reserve => {
        const plainReserve: any = reserve.get({ plain: true });
        plainReserve.lesson = await Lesson.findOne({
          where: { id: reserve.lesson_id }, include: [{
            model: Studio
          },
          {
            model: Instructor,
            as: 'instructors',
            attributes: ['name'],
            through: { attributes: [] }
          }]
        });
        return plainReserve;
      }));
      return Controller.ok(res, null, reserves, count);
    } catch (error) {
      return next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      return Controller.ok(res, null, req.session.reserve);
    } catch (error) {
      return next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {

      const schema = yup.object().shape({
        lesson_id: yup
          .number()
          .positive()
          .required(),
        place_id: yup
          .string()
          .required(),
        user_id: yup.number()
          .positive().nullable()
      });

      try {
        await validateYup(req.body, schema);
      } catch (err) {
        return Controller.badRequest(res, err.name, err.errors);
      }

      let user: User;
      if (req.body.user_id && req.session.user.role === 'admin') {
        user = await User.findByPk(req.body.user_id);
      } else {
        user = req.session.user as User;
      }

      if (!user) {
        return Controller.badRequest(res, 'El usuario indicado no fué encontrado.');
      }

      const lesson = await Lesson.findOne({
        where: {
          id: req.body.lesson_id,
          //starts_at: { [Op.gt]: moment().utc() }, The line is commented because a timezone query issue
        },
        include: [Studio, Instructor],
      });

      if (req.session.user.role !== 'admin') {
        if (moment().utcOffset('-06:00').diff(moment(lesson.ends_at).utcOffset('-06:00'), 'minutes') > 0) {
          return Controller.badRequest(res, 'No puedes reservar la clase, la clase ha iniciado o ha terminado.');
        }
      }

      if (!lesson) {
        return Controller.badRequest(res, 'La clase seleccionada no es válida.');
      }

      const place = await Place.findOne({ where: { id: req.body.place_id } });

      if (!place) {
        return Controller.badRequest(res, 'El lugar seleccionado no es válido.');
      }

      try {
        await findActiveReserve(req.body.lesson_id, req.body.place_id);
      } catch (error) {
        return Controller.badRequest(
          res,
          'El lugar que has seleccionado ha sido reservado.',
        );
      }

      if (req.session.user.role !== 'admin') {
        const diffDays = moment(lesson.starts_at).utc().utcOffset('-06:00').startOf('day').diff(moment().utcOffset('-06:00').startOf('day'), 'days');

        if (diffDays >= 7) {
          return Controller.badRequest(res, `No puedes reservar esta clase aún, intenta el día ${diffDays - 7 === 0 ? 'de mañana.' : `${moment().utc().utcOffset('-06:00').add(diffDays - 7, 'days').format('D')} del mes.`}`);
        }
      }

      let reserve = new Reserve();
      reserve.lesson_id = lesson.id;
      reserve.place_id = place.id;
      reserve.user_id = user.id;
      reserve.reserved_at = new Date();
      reserve.canceled_at = null;
      reserve.canceled = false;

      reserve = await reserve.save();


      const instructorsNameArray: string[] = await Promise.all(lesson.instructors.map(async (instructor) => {
        return instructor.name;
      }));

      let instructorsName: string = instructorsNameArray.join(', ');

      // Sending email
      const date = moment(lesson.starts_at).utc().utcOffset('-06:00');
      const actualDate = moment().utc().utcOffset('-06:00');
      let placeEnd = 0;
      if (place.location === '7B') {
        placeEnd = 8
      }else if (place.location.indexOf('A') === 1 || place.location.indexOf('A') === 2 || place.location.indexOf('B') === 1 || place.location.indexOf('B') === 2) {
        let p = parseInt(place.location.replace('A','').replace('B',''))
        if (p >= 8)
          placeEnd = p + 1
        else 
          placeEnd = p
      }
      if (date > actualDate) {
        await user.sendEmailReserve(
          false,
          date.format(config.date_format.date),
          date.format(config.date_format.time),
          lesson.studio,
          placeEnd === 0 ? place.location : placeEnd.toString(),
          instructorsName,
          lesson.meeting_url,
        );
      }
      return Controller.created(res, null, reserve);
    } catch (err) {
      console.log(err);
      return Controller.badRequest(res, err.message, err);
    }
  }

  async cancel(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const user = req.session.user as User;
      let reserve = req.session.reserve as Reserve;
      const lesson = (await reserve.$get('lesson', { include: [Instructor] })) as Lesson;

      if (user.role !== 'admin' && !lesson.community && moment(lesson.starts_at).utc().utcOffset('-06:00').diff(moment().utcOffset('-06:00'), 'hours') < 8) {
        return Controller.badRequest(res, 'No es posible cancelar una reservación 8 horas antes de la clase.')
      }

      reserve.canceled = true;
      reserve.canceled_at = new Date();
      reserve.canceled_by_user_id = user.id;
      reserve = await reserve.save();

      // Sending email

      const instructorsNameArray: string[] = await Promise.all(lesson.instructors.map(async (instructor) => {
        return instructor.name;
      }));

      let instructorsName: string = instructorsNameArray.join(', ');

      const date = moment(lesson.starts_at).utcOffset('-06:00');
      await this.sendEmailCancelation(
        reserve.user,
        date.format(config.date_format.date),
        date.format(config.date_format.time),
        instructorsName
      );

      return Controller.ok(res);
    } catch (err) {
      return next(err);
    }
  }

  private loadReserve() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query: FindOptions = {
          where: { id: req.params.id },
          include: [{ model: Lesson }, { model: User, as: 'user' }, { model: User, as: 'canceled_by_user' }],
        };

        if (req.session.user.role == 'user') {
          query.where['user_id'] = req.session.user.id;
        }

        const reserve = await Reserve.findOne(query);
        if (!reserve) {
          return Controller.notFound(res);
        }
        req.session.reserve = reserve;
        return next();
      } catch (error) {
        return next(error);
      }
    };
  }
}

const controller = new ReserveController();
export default controller;
