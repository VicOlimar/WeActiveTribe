import { Controller } from '../../libraries/Controller';
import { Request, Response, Router, NextFunction } from 'express';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';
import * as yup from 'yup';
import { config } from '../../config/config';
import { s3 } from '../../libraries/s3';
import { validateJWT, filterRoles } from '../../policies/General';
import {
  perPage,
  validateYup,
  findAvailablePlaces,
} from '../../libraries/util';
import { Instructor } from '../../models/Instructor';
import { StorageFile } from '../../models/StorageFile';
import { isNullOrUndefined } from 'util';
import moment = require('moment-timezone');
import { AssociationGetOptions } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { Lesson } from '../../models/Lesson';
import { Studio } from '../../models/Studio';
import { Place } from '../../models/Place';

const { bucket_name: bucket } = config.s3;
const upload = multer({ storage: multerS3({ s3, bucket }) });

export class InstructorController extends Controller {
  constructor() {
    super();
    this.name = 'instructor';
  }

  routes(): Router {
    this.router.get('/', (req: Request, res: Response, next: NextFunction) =>
      this.find(req, res, next),
    );

    this.router.get(
      '/:id/:lessons',
      this.loadInstructor(),
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
      '/:id/avatar',
      validateJWT('access'),
      filterRoles(['admin']),
      this.loadInstructor(),
      upload.single('avatar'),
      (req: Request, res: Response, next: NextFunction) =>
        this.avatar(req, res, next),
    );

    this.router.post(
      '/:id',
      validateJWT('access'),
      filterRoles(['admin']),
      this.loadInstructor(),
      (req: Request, res: Response, next: NextFunction) =>
        this.update(req, res, next),
    );

    this.router.delete(
      '/:id',
      validateJWT('access'),
      filterRoles(['admin']),
      this.loadInstructor(),
      (req: Request, res: Response, next: NextFunction) =>
        this.destroy(req, res, next),
    );

    return this.router;
  }

  async find(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { limit, offset } = perPage(req.query.per_page, req.query.page);
      const instructors = await Instructor.findAndCountAll({
        attributes: {
          exclude: ['created_at', 'updated_at', 'deleted_at', 'avatar_id'],
        },
        include: [{ model: StorageFile, as: 'avatar' }],
        limit,
        offset,
        order: ['name'],
      });

      const instructorsWithAvatar = instructors.rows.map(instructor =>
        instructor.getPlainWithAvatar(),
      ).sort(function (a, b) {
        var instructorA = a.name.toUpperCase();
        var instructorB = b.name.toUpperCase();
        return (instructorA < instructorB) ? -1 : (instructorA > instructorB) ? 1 : 0;
      });

      return Controller.ok(res, null, instructorsWithAvatar, instructors.count);
    } catch (error) {
      return next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const instructor = req.session.instructor as Instructor;

      const plainInstructor = instructor.getPlainWithAvatar();

      const schema = yup.object().shape({
        lessons: yup.boolean().default(false),
        preview: yup.boolean().default(false),
      });

      try {
        await validateYup(req.params, schema);
      } catch (err) {
        return Controller.badRequest(res, err.name, err.errors);
      }

      if (req.params.lessons) {
        const query: AssociationGetOptions = {};
        let startOfWeek: Date, endOfWeek: Date;

        if (req.params.preview) {
          startOfWeek = moment()
            .endOf('day')
            .add(1, 'week')
            .toDate();
          endOfWeek = moment()
            .endOf('day')
            .add(2, 'week')
            .toDate();
        } else {
          startOfWeek = moment()
            .startOf('day')
            .toDate();
          endOfWeek = moment()
            .endOf('day')
            .add(1, 'week')
            .toDate();
        }

        query.where = { starts_at: { [Op.between]: [startOfWeek, endOfWeek] } };

        query.include = [
          {
            model: Studio,
            as: 'studio',
            include: [{ model: Place, as: 'places' }],
          },
          {
            model: Place,
            as: 'reserved_places',
            attributes: ['id'],
          },
        ];

        const lessons = (await instructor.$get('lessons', query)) as Lesson[];

        plainInstructor.lessons = lessons.map(lesson => {
          const available = findAvailablePlaces(
            lesson.studio.places,
            lesson.reserved_places,
          );
          const plain: any = lesson.get({ plain: true });
          plain.available = available.length;
          delete plain.reserved_places;
          return plain;
        });
      }

      return Controller.ok(res, null, plainInstructor);
    } catch (error) {
      return next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const schema = yup.object().shape({
        name: yup.string().required(),
        description: yup.string().required(),
        email: yup.string().required(),
        experience: yup.string().nullable(),
      });

      try {
        await validateYup(req.body, schema);
      } catch (err) {
        return Controller.badRequest(res, err.name, err.errors);
      }

      const instructor = await Instructor.create(req.body);
      return Controller.created(res, null, instructor);
    } catch (err) {
      return next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const instructor = req.session.instructor as Instructor;

      const schema = yup.object().shape({
        name: yup.string(),
        description: yup.string(),
        email: yup.string()
      });

      try {
        await validateYup(req.body, schema);
      } catch (err) {
        return Controller.badRequest(res, err.name, err.errors);
      }

      const result = await instructor.update(req.body);
      return Controller.ok(res, null, result);
    } catch (err) {
      return next(err);
    }
  }

  async destroy(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const instructor = req.session.instructor as Instructor;

      const fromNow = moment().utc().utcOffset('-05:00').toDate();

      const lessons = (await instructor.$count('lessons', {where: {ends_at: {[Op.gte] : fromNow}}}));

      if(lessons > 0) {
        return Controller.badRequest(res, 'El instructor tiene clases futuras.')
      };

      await instructor.destroy();
      return Controller.noContent(res);
    } catch (error) {
      return next(error);
    }
  }

  async avatar(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      let instructor = req.session.instructor as Instructor;
      if (!isNullOrUndefined(instructor.avatar)) {
        const avatar = instructor.avatar as StorageFile;
        await avatar.destroy();
      }

      let avatar = new StorageFile();
      avatar.etag = req.file.etag;
      avatar.mimetype = req.file.mimetype;
      avatar.key = req.file.key;

      avatar = await avatar.save();

      instructor.avatar_id = avatar.id;
      instructor = await instructor.save();

      return Controller.ok(res, null, { url: avatar.getUrlFile() });
    } catch (error) {
      return next(error);
    }
  }

  private loadInstructor() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const instructor = await Instructor.findByPk(req.params.id, {
          attributes: {
            exclude: ['created_at', 'updated_at', 'deleted_at', 'avatar_id'],
          },
          include: [{ model: StorageFile, as: 'avatar' }],
          order: [['created_at', 'DESC']],
        });
        if (!instructor) {
          return Controller.notFound(res);
        }
        req.session.instructor = instructor;
        return next();
      } catch (error) {
        return next(error);
      }
    };
  }
}

const controller = new InstructorController();
export default controller;
