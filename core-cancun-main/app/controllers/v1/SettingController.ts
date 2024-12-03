import { Controller } from '../../libraries/Controller';
import { Request, Response, Router, NextFunction } from 'express';
import { validateJWT, filterRoles } from '../../policies/General';
import { perPage } from '../../libraries/util';
import Setting from '../../models/Setting';

export class SettingController extends Controller {
  constructor() {
    super();
    this.name = 'setting';
  }

  routes(): Router {
    this.router.get('/', (req: Request, res: Response, next: NextFunction) =>
      this.find(req, res, next),
    );

    this.router.get('/:key', (req: Request, res: Response, next: NextFunction) =>
      this.findOne(req, res, next),
    );

    this.router.post(
      '/',
      validateJWT('access'),
      filterRoles(['admin']),
      (req: Request, res: Response, next: NextFunction) =>
        this.createOrUpdate(req, res, next),
    );

    this.router.put(
      '/:key',
      validateJWT('access'),
      filterRoles(['admin']),
      (req: Request, res: Response, next: NextFunction) =>
        this.createOrUpdate(req, res, next),
    );

    this.router.delete(
      '/:key',
      validateJWT('access'),
      filterRoles(['admin']),
      (req: Request, res: Response, next: NextFunction) =>
        this.destroy(req, res, next),
    );

    return this.router;
  }

  async find(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { limit, offset } = perPage(req.query.per_page, req.query.page);
      const settings = await Setting.findAndCountAll({
        limit,
        offset,
        order: [['key', 'ASC']],
      });

      return Controller.ok(res, null, settings.rows, settings.count);
    } catch (error) {
      return next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { key } = req.params;
      const setting = await Setting.findOne({ where: { key } });
      if (setting) {
        return Controller.ok(res, null, setting);
      } else {
        return Controller.notFound(res);
      }
    } catch (error) {
      return next(error);
    }
  }

  async createOrUpdate(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const key = req.params.key || req.body.key;
      const { value } = req.body;
      
      if (!key || !value) {
        return Controller.badRequest(res, 'Validation error', ['Key and value are required']);
      }

      // Check if the setting exists (including soft-deleted ones)
      let setting = await Setting.findOne({
        where: { key },
        paranoid: false // This allows us to find soft-deleted records
      });

      if (setting) {
        // If the setting exists, update it and restore if it was soft-deleted
        setting.value = value;
        setting.deleted_at = null; // This will restore the record if it was soft-deleted
        await setting.save();
        return Controller.ok(res, null, setting);
      } else {
        // If the setting doesn't exist, create a new one
        setting = await Setting.create({ key, value });
        return Controller.created(res, null, setting);
      }
    } catch (error) {
      return next(error);
    }
  }

  async destroy(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { key } = req.params;
      const deleted = await Setting.destroy({ where: { key } });
      if (deleted) {
        return Controller.noContent(res);
      } else {
        return Controller.notFound(res);
      }
    } catch (error) {
      return next(error);
    }
  }
}

const controller = new SettingController();
export default controller;