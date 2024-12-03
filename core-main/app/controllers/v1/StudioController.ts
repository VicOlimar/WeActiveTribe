import { Controller } from '../../libraries/Controller';
import { Request, Response, Router, NextFunction } from 'express';
import { Studio } from '../../models/Studio';
import { perPage, validateYup } from '../../libraries/util';
import { log } from '../../libraries/Log';
import LessonController from './LessonController';
import { Place } from '../../models/Place';
import { AssociationGetOptions } from 'sequelize-typescript';
import * as yup from 'yup';
import { Lesson } from '../../models/Lesson';
import { filterRoles, validateJWT } from '../../policies/General';
import { Op, WhereOptions } from 'sequelize';
import { Instructor } from '../../models/Instructor';
import { Reserve } from '../../models/Reserve';
import { Credit } from '../../models/Credit';
import { Charge } from '../../models/Charge';

export class StudioController extends Controller {
  constructor() {
    super();
    this.name = 'studio';
  }

  routes(): Router {
    this.router.get('/', (req: Request, res: Response, next: NextFunction) =>
      this.find(req, res, next),
    );

    this.router.get(
      `/report`,
      validateJWT('access'),
      filterRoles(['admin']),
      this.report,
    );

    this.router.get(
      '/:slug',
      this.loadStudio(),
      (req: Request, res: Response, next: NextFunction) =>
        this.findOne(req, res, next),
    );

    this.router.use(
      `/:slug/${LessonController.name}`,
      this.loadStudio(),
      LessonController.routes(),
    );

    return this.router;
  }

  async find(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { limit, offset } = perPage(req.query.per_page, req.query.page);
      const studios = await Studio.findAndCountAll({ limit, offset });
      return Controller.ok(res, null, studios.rows, studios.count);
    } catch (error) {
      return next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      return Controller.ok(res, null, req.session.studio);
    } catch (error) {
      return next(error);
    }
  }

  async report(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const schema = yup.object().shape({
        start_date: yup.date().required(),
        end_date: yup.date().required(),
      });

      try {
        await validateYup(req.query, schema);
      } catch (err) {
        return Controller.badRequest(res, err.name, err.errors);
      }

      const { studio_id, instructor_id, start_date, end_date } = req.query;

      const query: AssociationGetOptions = {
        where: {
          [Op.and]: [
            {
              starts_at: { [Op.gte]: start_date },
            },
            {
              starts_at: { [Op.lte]: end_date },
            },
          ],
        },
        attributes: ['id', 'name', 'starts_at'],
        include: [
          {
            model: Studio,
            attributes: ['name'],
          },
          {
            model: Place,
            as: 'reserved_places',
            attributes: ['location'],
          },
        ],
        order: [['starts_at', 'ASC']],
      };

      if (studio_id) {
        query.where['studio_id'] = studio_id;
      }

      let instructorCondition: WhereOptions = {};
      let requiredInstructor = false;

      if (instructor_id) {
        requiredInstructor = true;
        instructorCondition = {
          id: instructor_id,
        };
      }
      
      query.include.push({
        model: Instructor,
        attributes: ['name', 'id', 'experience'],
        where: instructorCondition,
        required: requiredInstructor,
      });
      query.attributes = { exclude: ['meeting_url'] };

      const lessons: Lesson[] = await Lesson.findAll(query);
      const lessonsWithCourtesies = await Promise.all(
        lessons.map(async (lesson: Lesson & { courtesies: number }) => {
          let plainLesson: any = lesson.get({ plain: true });
          const credits_ids = lesson.reserved_places.map(
            ({ Reserve }: Place & { Reserve: Reserve }) => Reserve.credit_id,
          );
          const courtesies = await Credit.count({
            where: { id: { [Op.in]: credits_ids } },
            include: [
              {
                model: Charge,
                where: { payment_type: 'courtesy' },
                required: true,
              },
            ],
          });

          plainLesson.courtesies = courtesies;
          plainLesson.instructors = lesson.instructors;
          plainLesson.reserved_places = lesson.reserved_places;
          return plainLesson;
        }),
      );

      return Controller.ok(res, null, lessonsWithCourtesies);
    } catch (err) {
      return next(err);
    }
  }

  private loadStudio() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const studio = await Studio.findOne({
          where: { slug: req.params.slug },
          include: [Place],
        });
        if (!studio) {
          return Controller.notFound(res);
        }
        req.session.studio = studio;

        return next();
      } catch (error) {
        return next(error);
      }
    };
  }
}

const controller = new StudioController();
export default controller;
