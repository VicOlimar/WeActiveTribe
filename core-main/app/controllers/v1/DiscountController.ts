import { Controller } from '../../libraries/Controller';
import { Request, Response, Router, NextFunction } from 'express';
import * as yup from 'yup';
import { validateJWT, filterRoles, onlyLogged } from '../../policies/General';
import { perPage, validateYup } from '../../libraries/util';
import { Discount } from '../../models/Discount';
import { Op } from 'sequelize';
import { Charge } from '../../models/Charge';

export class DiscountController extends Controller {
  constructor() {
    super();
    this.name = 'discount';
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
      '/:id',
      validateJWT('access'),
      filterRoles(['admin']),
      this.loadDiscount(),
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
      this.loadDiscount(),
      (req: Request, res: Response, next: NextFunction) =>
        this.update(req, res, next),
    );

    this.router.delete(
      '/:id',
      validateJWT('access'),
      filterRoles(['admin']),
      this.loadDiscount(),
      (req: Request, res: Response, next: NextFunction) =>
        this.destroy(req, res, next),
    );

    return this.router;
  }

  async find(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { limit, offset } = perPage(req.query.per_page, req.query.page);
      const discounts = await Discount.findAndCountAll({
        attributes: {
          exclude: ['created_at', 'updated_at', 'deleted_at'],
        },
        limit,
        offset,
      });

      return Controller.ok(res, null, discounts.rows, discounts.count);
    } catch (error) {
      return next(error);
    }
  }

  async validate(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const discount = await Discount.findOne({
        attributes: ['discount', 'type'],
        where: { 
          code: { [Op.iLike]: req.body.code }, 
          expires_after: { [Op.gt]: new Date() },
        }
      });

      if (!discount) {
        return Controller.notFound(res);
      }

      if (discount.total_uses !== 0) {
        const charges = await discount.$get('charges', {where: {
          status: 'paid'
        } }) as Charge[];

        if(charges.length >= discount.total_uses) {
          return Controller.notFound(res);
        }
      }

      return Controller.ok(res, null, discount);
    } catch (error) {
      return next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const discount = req.session.discount as Discount;

      return Controller.ok(res, null, discount);
    } catch (error) {
      return next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const schema = yup.object().shape({
        code: yup.string().required(),
        total_uses: yup.number().required(),
        discount: yup.number().required(),
        type: yup.string().required(),
        expires_after: yup.date(),

      });

      try {
        await validateYup(req.body, schema);
      } catch (err) {
        return Controller.badRequest(res, err.name, err.errors);
      }

      const discount = await Discount.create(req.body);
      return Controller.created(res, null, discount);
    } catch (err) {
      return next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const instructor = req.session.discount as Discount;

      const schema = yup.object().shape({
        code: yup.string().required(),
        total_uses: yup.number().required(),
        discount: yup.number().required(),
        type: yup.string().required(),
        expires_after: yup.date(),
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
      const discount = req.session.discount as Discount;
      await discount.destroy();
      return Controller.noContent(res);
    } catch (error)  {
      return next(error);
    }
  }

  private loadDiscount() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const discount = await Discount.findByPk(req.params.id);
        if (!discount) {
          return Controller.notFound(res);
        }
        req.session.discount = discount;
        return next();
      } catch (error) {
        return next(error);
      }
    };
  }
}

const controller = new DiscountController();
export default controller;
