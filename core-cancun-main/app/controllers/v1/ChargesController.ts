import { Controller } from '../../libraries/Controller';
import { Request, Response, Router } from 'express';
import { validateJWT, onlyLogged, filterRoles } from '../../policies/General';
import {
  FindAndCountOptions,
  FindOptions,
  Op,
  Includeable,
  Order,
} from 'sequelize';
import { User } from '../../models/User';
import { perPage, sort, or } from '../../libraries/util';
import { NextFunction } from 'connect';
import { Charge } from '../../models/Charge';
import { Plan } from '../../models/Plan';
import { parse } from 'json2csv';
import * as yup from 'yup';
import { validateYup } from '../../libraries/util';
import * as moment from 'moment-timezone';
import { Credit } from '../../models/Credit';
import { OnlineCredit } from '../../models/OnlineCredit';

export class ChargesController extends Controller {
  constructor() {
    super();
    this.name = 'charges';
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
      this.loadCharge(),
      (req: Request, res: Response, next: NextFunction) =>
        this.findOne(req, res, next),
    );

    this.router.post(
      '/:id/cancel',
      validateJWT('access'),
      filterRoles(['admin']),
      onlyLogged(),
      this.loadCharge(),
      (req: Request, res: Response, next: NextFunction) =>
        this.cancel(req, res, next),
    );

    this.router.post(
      '/',
      validateJWT('access'),
      filterRoles(['admin']),
      onlyLogged(),
      (req: Request, res: Response, next: NextFunction) =>
        this.create(req, res, next),
    );

    return this.router;
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const schema = yup.object().shape({
        user_id: yup
          .number()
          .required('No se puede crear un cargo sin usuario'),
        credits: yup
          .number()
          .required('No se puede crear un cargo de cortesía sin créditos'),
        credit_type: yup
          .mixed()
          .required('Se debe indicar el tipo de crédito que se dará.')
          .oneOf(['online', 'classic']),
        payment_method: yup
          .mixed()
          .required('El método de pago debe ser Cortesía')
          .oneOf(['courtesy']),
      });

      try {
        await validateYup(req.body, schema);
      } catch (err) {
        return Controller.badRequest(res, err.name, err.errors);
      }

      const user = await User.findByPk(req.body.user_id);
      if (!user) {
        return Controller.badRequest(res, 'No existe el usuario elegido.');
      }

      const charge = new Charge();
      charge.status = 'paid';

      charge.order_id = '';
      charge.currency = 'MXN';
      charge.customer_name = user.name;
      charge.auth_code = '';
      charge.processed_at = new Date();
      charge.paid = 0;
      charge.total_credits = req.body.credits;

      charge.payment_method = req.body.payment_method;
      charge.card_type = 'cash';
      charge.card_brand = 'cash';
      charge.issuer = '';
      charge.fee = 0;
      charge.card_last4 = '';

      charge.user_id = user.id;
      charge.plan_name = `courtesy-${req.body.credit_type}`;
      await charge.save(req.body.payment_method);

      return Controller.created(res, null, charge);
    } catch (error) {
      return Controller.serverError(
        res,
        'Ocurrió un problema al asignar los créditos.',
      );
    }
  }

  async find(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { limit, offset } = perPage(req.query.per_page, req.query.page);
      const order: Order = sort(req.query.sort);

      const format = req.query.format || 'json';

      const query: FindAndCountOptions = {
        order,
        include: [
          { model: User },
          { model: Credit, as: 'credits' },
          { model: OnlineCredit, as: 'online_credits' },
        ],
        where: {},
      };

      if (format !== 'csv') {
        query.limit = limit;
        query.offset = offset;
      }

      if (req.session.user.role === 'user') {
        query.where = { user_id: req.session.user.id };
      }

      if (req.session.user.role === 'admin') {
        if (req.query.user_id) {
          query.where = { user_id: req.query.user_id };
        }

        if (req.query.search || req.query.payment_method) {
          const user_include: Includeable = {
            model: User,
            where: { [Op.or]: [] },
          };
          if (req.query.search) {
            user_include.where[Op.or].push({
              email: { [Op.iLike]: `%${req.query.search}%` },
            });
            user_include.where[Op.or].push({
              name: { [Op.iLike]: `%${req.query.search}%` },
            });
          }

          if (req.query.payment_method) {
            query.where['payment_method'] = or(req.query.payment_method);
          }

          query.include.push(user_include);
        }

        if (req.query.orderBy) {
          const type: string = req.query.orderBy.split(',')[0];
          const order: string = req.query.orderBy.split(',')[1];
          if (type === 'plan') {
            query.order = [[{ model: Plan, as: 'plan' }, 'name', order]];
          } else if (type === 'name') {
            query.order = [[{ model: User, as: 'user' }, 'name', order]];
          } else if (type === 'email') {
            query.order = [[{ model: User, as: 'user' }, 'email', order]];
          } else {
            query.order = [[type, order]];
          }
        }
        if (req.query.filterBy) {
          query.where['status'] = or(req.query.filterBy);
        }
        if (req.query.filterByPlan) {
          query.where['plan_name'] = or(req.query.filterByPlan);
        }

        if (req.query.start_date && req.query.end_date) {
          const start = moment(req.query.start_date)
            .startOf('day')
            .toDate()
            .toISOString();
          const end = moment(req.query.end_date)
            .endOf('day')
            .toDate()
            .toISOString();
          query.where['created_at'] = { [Op.between]: [start, end] };
        }
      }

      const charges = await Charge.findAndCountAll(query);
      const chargesCount = await Charge.count({ ...query, include: [] });

      if (format === 'csv' && req.session.user.role === 'admin') {
        const fields = [
          { label: 'Monto', value: 'paid' },
          { label: 'Estado', value: 'status' },
          { label: 'Créditos', value: 'total_credits' },
          { label: 'Nombre en tarjeta', value: 'customer_name' },
          { label: 'Método de pago', value: 'payment_method' },
          {
            label: 'Fecha de pago',
            value: (row: any) =>
              moment(row.created_at)
                .utcOffset('-05:00')
                .format('D [de] MMMM [-] h:mm A'),
          },
          { label: 'Nombre del plan', value: 'plan_name' },
          { label: 'Precio del plan', value: 'paid' },
          { label: 'Créditos otorgados en el plan', value: 'total_credits' },
          {
            label: 'Nombre de Usuario',
            value: (row: any) => {
              const chargePlain = row.get({ plain: true });
              return chargePlain.user
                ? `${chargePlain.user.name} ${chargePlain.user.last_name}`
                : 'No disponible';
            },
          },
          { label: 'Email de Usuario', value: 'user.email' },
        ];

        const csv = parse(charges.rows, { fields, quote: '' });
        return Controller.ok(res, null, csv);
      }

      return Controller.ok(res, null, charges.rows, chargesCount);
    } catch (error) {
      return next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      return Controller.ok(res, null, req.session.charge);
    } catch (error) {
      return next(error);
    }
  }

  async cancel(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const charge: Charge = req.session.charge;
      charge.status = 'canceled';
      try {
        await charge.save();
      } catch (err) {
        return Controller.badRequest(res, err.message);
      }

      return Controller.ok(res, null, charge);
    } catch (error) {
      return next(error);
    }
  }

  private loadCharge() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query: FindOptions = {
          where: { id: req.params.id },
        };

        if (req.session.user.role == 'user') {
          query.where['user_id'] = req.session.user.id;
        }

        const charge = await Charge.findOne(query);
        if (!charge) {
          return Controller.notFound(res);
        }
        req.session.charge = charge;

        return next();
      } catch (error) {
        return next(error);
      }
    };
  }
}

const controller = new ChargesController();
export default controller;
