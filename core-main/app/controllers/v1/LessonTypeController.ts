import { Controller } from '../../libraries/Controller';
import { Request, Response, Router, NextFunction } from 'express';
import * as yup from 'yup';
import { validateJWT, filterRoles, onlyLogged } from '../../policies/General';
import { perPage, validateYup } from '../../libraries/util';
import { Discount } from '../../models/Discount';
import { FindAndCountOptions, FindOptions, Op } from 'sequelize';
import { Charge } from '../../models/Charge';
import { LessonType } from '../../models/LessonType';
import { Lesson } from '../../models/Lesson';
import { Plan } from '../../models/Plan';

export class LessonTypeController extends Controller {
  constructor() {
    super();
    this.name = 'lesson_type';
  }

  routes(): Router {
    this.router.get(
      '/',
      validateJWT('access'),
      filterRoles(['admin']),
      (req: Request, res: Response, next: NextFunction) =>
        this.find(req, res, next),
    );

    this.router.get(
      '/all',
      validateJWT('access'),
      filterRoles(['admin']),
      (req: Request, res: Response, next: NextFunction) =>
        this.findAll(req, res, next),
    );

    this.router.get(
      '/:id',
      validateJWT('access'),
      filterRoles(['admin']),
      this.loadLessonType(),
      (req: Request, res: Response, next: NextFunction) =>
        this.findOne(req, res, next),
    );

    this.router.post(
      '/',
      validateJWT('access'),
      filterRoles(['admin']),
      (req: Request, res: Response, next: NextFunction) =>
        this.create(req, res, next),
    );

    this.router.post(
      '/:id',
      validateJWT('access'),
      filterRoles(['admin']),
      this.loadLessonType(),
      (req: Request, res: Response, next: NextFunction) =>
        this.update(req, res, next),
    );

    this.router.delete(
      '/:id',
      validateJWT('access'),
      filterRoles(['admin']),
      this.loadLessonType(),
      (req: Request, res: Response, next: NextFunction) =>
        this.destroy(req, res, next),
    );

    return this.router;
  }

  async find(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { limit, offset } = perPage(req.query.per_page, req.query.page);
      let query: FindAndCountOptions = {
        attributes: {
          exclude: ['created_at', 'updated_at', 'deleted_at'],
        },
      }
      if (req.query.per_page && req.query.page) {
        query.limit = limit;
        query.offset = offset;
      }
      const lesson_types = await LessonType.findAndCountAll(query);

      return Controller.ok(res, null, lesson_types.rows, lesson_types.count);
    } catch (error) {
      return next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      let query: FindOptions = {
        attributes: {
          exclude: ['created_at', 'updated_at', 'deleted_at'],
        },
      };

      const lesson_type = await LessonType.findAll(query);
      return Controller.ok(res, null, lesson_type, lesson_type.length);
    } catch (error) {
      return next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const lesson_type = req.session.lesson_type as LessonType;

      return Controller.ok(res, null, lesson_type);
    } catch (error) {
      return next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const schema = yup.object().shape({
        name: yup.string().required(),
      });

      try {
        await validateYup(req.body, schema);
      } catch (err) {
        return Controller.badRequest(res, err.name, err.errors);
      }

      const existingLessonType = await LessonType.count({
        where: {
          name: {
            [Op.iLike]: req.body.name
          }
        }
      });

      if (existingLessonType > 0) {
        return Controller.badRequest(res, 'Ya existe una tipo de clase con este nombre.');
      }

      const lesson_type = await LessonType.create(req.body);
      return Controller.created(res, null, lesson_type);
    } catch (err) {
      return next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const lesson_type = req.session.lesson_type as LessonType;

      const schema = yup.object().shape({
        name: yup.string().required(),
      });

      try {
        await validateYup(req.body, schema);
      } catch (err) {
        return Controller.badRequest(res, err.name, err.errors);
      }

      const existingLessonType = await LessonType.count({
        where: {
          id: {
            [Op.not]: lesson_type.id,
          },
          name: {
            [Op.iLike]: req.body.name
          }
        }
      });

      if (existingLessonType > 0) {
        return Controller.badRequest(res, 'Ya existe una tipo de clase con este nombre.');
      }

      const result = await lesson_type.update(req.body);
      return Controller.ok(res, null, result);
    } catch (err) {
      return next(err);
    }
  }

  async destroy(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const lesson_type = req.session.lesson_type as LessonType;

      const lessonsWithTheType = await Lesson.findAll({
        where: {
          lesson_type_id: lesson_type.id
        }
      });
      const plansWithTheType = await Plan.findAll({
        where: {
          lesson_type_id: lesson_type.id
        }
      });

      if (lessonsWithTheType.length > 0) {
        return Controller.badRequest(res, 'Existe una o más clases con este tipo, no puedes eliminarla.');
      }
      if (plansWithTheType.length > 0) {
        return Controller.badRequest(res, 'Existe un paquete con este tipo de clase, no puedes eliminarla.');
      }

      await lesson_type.destroy();

      // We update all lessons with the lesson type
      await Lesson.update({
        lesson_type_id: null
      }, {
        where: {
          lesson_type_id: lesson_type.id
        }
      });
      return Controller.noContent(res);
    } catch (error) {
      return next(error);
    }
  }

  private loadLessonType() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const lesson_type = await LessonType.findByPk(req.params.id);
        if (!lesson_type) {
          return Controller.notFound(res);
        }
        req.session.lesson_type = lesson_type;
        return next();
      } catch (error) {
        return next(error);
      }
    };
  }
}

const controller = new LessonTypeController();
export default controller;
