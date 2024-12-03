import { Controller } from '../../libraries/Controller';
import { Request, Response, Router } from 'express';
import { validateJWT, onlyLogged } from '../../policies/General';
import * as yup from 'yup';
import * as moment from 'moment-timezone';
import { Lesson } from '../../models/Lesson';
import { Op, FindOptions } from 'sequelize';
import { User } from '../../models/User';
import { validateYup, perPage } from '../../libraries/util';
import { NextFunction } from 'connect';
import { Waiting } from '../../models/Waiting';
import { log } from '../../libraries/Log';
import mailer from '../../services/EmailService';
import { Instructor } from '../../models/Instructor';
import { Studio } from '../../models/Studio';
import { config } from '../../config/config';
import { Reserve } from '../../models/Reserve';

export class WaitingController extends Controller {
  constructor() {
    super();
    this.name = 'waiting';
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
      this.loadWaiting(),
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
      this.loadWaiting(),
      (req: Request, res: Response, next: NextFunction) =>
        this.cancel(req, res, next),
    );

    return this.router;
  }

  async find(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const user: User = req.session.user;
      const { limit, offset } = perPage(req.query.per_page, req.query.page);

      const waitings = await Waiting.findAndCountAll({
        where: { user_id: user.id, canceled: false },
        order: [
          [{ model: Lesson, as: 'lesson' }, 'starts_at', 'DESC'],
        ],
        include: [{
          model: Lesson, include: [Instructor, { model: Studio, attributes: ['name', 'slug'] }], where: {
            starts_at: {
              [Op.gte]: moment().utc().toDate()
            }
          },
          duplicating: true, // This is for avoid a Sequelize error related with the from clausule in query
        }, Reserve],
        limit,
        offset,
      });

      return Controller.ok(res, null, waitings.rows, waitings.count);
    } catch (error) {
      return next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      return Controller.ok(res, null, req.session.waiting);
    } catch (error) {
      return next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const user = req.session.user as User;

      const schema = yup.object().shape({
        lesson_id: yup
          .number()
          .positive()
          .required(),
      });

      try {
        await validateYup(req.body, schema);
      } catch (err) {
        return Controller.badRequest(res, err.name, err.errors);
      }

      const lesson = await Lesson.findOne({
        where: {
          id: req.body.lesson_id,
          starts_at: { [Op.gt]: new Date() },
        },
        include: [Instructor, Studio]
      });

      if (!lesson) {
        return Controller.badRequest(res, 'No podemos reservar en la clase seleccionada');
      }

      const instructorsNameArray: string[] = await Promise.all(lesson.instructors.map(async (instructor) => {
        return instructor.name;
      }));

      let instructorsName: string = instructorsNameArray.join(', ');

      let waiting = new Waiting();
      waiting.lesson_id = lesson.id;
      waiting.user_id = user.id;
      waiting.date = new Date();
      waiting.canceled = false;
      waiting = await waiting.save();

      const date = moment(lesson.starts_at).utcOffset('-05:00');
      await user.sendWaitingEmail(
        date.format(config.date_format.date),
        date.format(config.date_format.time),
        lesson.studio.name,
        instructorsName
      );
      return Controller.created(res, null, waiting);
    } catch (err) {
      return next(err);
    }
  }

  async cancel(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      let waiting = req.session.waiting as Waiting;

      waiting.canceled = true;
      waiting = await waiting.save();

      return Controller.ok(res);
    } catch (err) {
      return next(err);
    }
  }

  private loadWaiting() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query: FindOptions = {
          where: { id: req.params.id },
          include: [{ model: Lesson }],
        };

        if (req.session.user.role == 'user') {
          query.where['user_id'] = req.session.user.id;
        }

        const waiting = await Waiting.findOne(query);

        if (!waiting) {
          return Controller.notFound(res);
        }
        req.session.waiting = waiting;

        return next();
      } catch (error) {
        return next(error);
      }
    };
  }
}

const controller = new WaitingController();
export default controller;
