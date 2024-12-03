import { Controller } from '../../libraries/Controller';
import { Request, Response, Router, NextFunction } from 'express';
import { Plan } from '../../models/Plan';
import { asyncForEach, perPage, validateYup } from '../../libraries/util';
import * as yup from 'yup'; // for everything
import { validateJWT, filterRoles, onlyLogged } from '../../policies/General';
import { User } from '../../models/User';
import { isNullOrUndefined } from 'util';
import { Conekta, CustomerActionable, Customer } from '../../libraries/Conekta';
import { Discount } from '../../models/Discount';
import { Op } from 'sequelize';
import { Charge } from '../../models/Charge';
import axios from 'axios';
import { config } from '../../config/config';
import { FindAndCountOptions } from 'sequelize';
import { Lesson } from '../../models/Lesson';
import { PaymentGatewayFactory } from '../../libraries/PaymentGatewayFactory';

export class PlanController extends Controller {
  static PAYPAL_URL = config.paypal.api_url;

  static AUTH_TOKEN_HEADERS = {
    auth: {
      username: config.paypal.api_client_id,
      password: config.paypal.api_client_secret,
    },
    'Content-type': 'application/x-www-form-urlencoded',
  };
  static AUTH_TOKEN_BODY = new URLSearchParams([
    ['grant_type', 'client_credentials'],
  ]);

  constructor() {
    super();
    this.name = 'plan';
  }

  routes(): Router {
    this.router.get(
      '/',
      validateJWT('access'),
      (req: Request, res: Response, next: NextFunction) =>
        this.find(req, res, next),
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
      this.loadPlan(),
      (req: Request, res: Response, next: NextFunction) =>
        this.findOne(req, res, next),
    );

    this.router.post(
      '/:id',
      validateJWT('access'),
      filterRoles(['admin']),
      this.loadPlan(),
      (req: Request, res: Response, next: NextFunction) =>
        this.update(req, res, next),
    );

    this.router.delete(
      '/:id',
      validateJWT('access'),
      filterRoles(['admin']),
      this.loadPlan(),
      (req: Request, res: Response, next: NextFunction) =>
        this.destroy(req, res, next),
    );

    this.router.post(
      '/:id/status',
      validateJWT('access'),
      filterRoles(['admin']),
      onlyLogged(),
      this.loadPlan(),
      (req: Request, res: Response, next: NextFunction) =>
        this.status(req, res, next),
    );

    this.router.post(
      '/:id/purchase',
      validateJWT('access'),
      onlyLogged(),
      this.loadPlan(),
      (req: Request, res: Response, next: NextFunction) =>
        this.purchase(req, res, next),
    );

    this.router.post(
      '/:id/paypal',
      validateJWT('access'),
      onlyLogged(),
      this.loadPlan(),
      (req: Request, res: Response, next: NextFunction) =>
        this.paypal(req, res, next),
    );

    this.router.post(
      '/:id/pos',
      validateJWT('access'),
      onlyLogged(),
      filterRoles(['admin']),
      this.loadPlan(),
      (req: Request, res: Response, next: NextFunction) =>
        this.pos(req, res, next),
    );

    return this.router;
  }

  async find(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { limit, offset } = perPage(req.query.per_page, req.query.page);
      const order: string = req.query.orderBy;
      const query: FindAndCountOptions = {
        limit,
        offset,
      };

      if (req.query.active_desktop) {
        query.where = { active: true };
      } else {
        query.where = { active_mobile: true };
      }

      /*
      Todo: Remove the previous else and remove this code
      if (req.query.active_mobile) {
        query.where = { active_mobile: true };
      }
      */

      if (
        req.session.user &&
        req.session.user.role === 'admin' &&
        !req.query.active_desktop &&
        !req.query.active_mobile
      ) {
        delete query.where['active'];
        delete query.where['active_mobile'];
      }

      if (order) {
        const orderArr = order.split(',');
        query.order = [[orderArr[0], orderArr[1]]];
      } else {
        query.order = [['created_at', 'DESC']];
      }
      const plans = await Plan.findAndCountAll(query);

      return Controller.ok(res, null, plans.rows, plans.count);
    } catch (error) {
      return next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const plan = req.session.plan as Plan;
      const plain = plan.get({ plain: true }) as any;
      plain.payment_type = plain.payment_method;
      return Controller.ok(res, null, plain);
    } catch (error) {
      return next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const schema = yup.object().shape({
        name: yup.string().required(),
        special: yup.boolean().required(),
        price: yup
          .number()
          .required()
          .positive(),
        credits: yup
          .number()
          .required()
          .positive(),
        expires_numbers: yup
          .number()
          .required()
          .positive(),
        expires_unit: yup
          .mixed()
          .required()
          .oneOf(['years', 'months', 'days']),
        credit_type: yup
          .mixed()
          .required()
          .oneOf(['classic', 'online']),
        lesson_type_id: yup.number().nullable(),
        studio_id: yup.number().nullable(),
      });

      try {
        await validateYup(req.body, schema);
      } catch (err) {
        return Controller.badRequest(res, err.name, err.errors);
      }

      const plan = await Plan.create(req.body);
      return Controller.created(res, null, plan);
    } catch (err) {
      return next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const plan = req.session.plan as Plan;

      const schema = yup.object().shape({
        name: yup.string().required(),
        special: yup.boolean().required(),
        price: yup
          .number()
          .required()
          .positive(),
        credits: yup
          .number()
          .required()
          .positive(),
        expires_numbers: yup
          .number()
          .required()
          .positive(),
        expires_unit: yup
          .mixed()
          .required()
          .oneOf(['years', 'months', 'days']),
        credit_type: yup
          .mixed()
          .required()
          .oneOf(['classic', 'online']),
        lesson_type_id: yup.number().nullable(),
        studio_id: yup.number().nullable(),
      });

      try {
        await validateYup(req.body, schema);
      } catch (err) {
        return Controller.badRequest(res, err.name, err.errors);
      }

      const result = await plan.update(req.body);
      return Controller.ok(res, null, result);
    } catch (err) {
      return next(err);
    }
  }

  async destroy(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const plan = req.session.plan as Plan;
      await plan.destroy();
      return Controller.noContent(res);
    } catch (error) {
      return next(error);
    }
  }

  async status(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const plan: Plan = req.session.plan;

      const schema = yup.object().shape({
        status: yup.boolean().required(),
        status_mobile: yup.boolean().required(),
      });

      try {
        await validateYup(req.body, schema);
      } catch (err) {
        return Controller.badRequest(res, err.name, err.errors);
      }

      plan.active = req.body.status || false;
      plan.active_mobile = req.body.status_mobile || false;

      await plan.save();
      return Controller.ok(res, null, plan);
    } catch (error) {
      return next(error);
    }
  }

  async purchase(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const user = req.session.user as User;
      const plan = req.session.plan as Plan;

      if (!plan.active) {
        return Controller.badRequest(
          res,
          'Este plan no se encuentra disponible.',
        );
      }

      // todo: validate plans that only work for new users
      // Validate if user has a past reserve
      // Bad request if not new user

      const schema = yup.object().shape({
        card_id: yup.string(),
        token_id: yup.string(),
        code: yup.string(),
      });

      try {
        await validateYup(req.body, schema);
      } catch (err) {
        return Controller.badRequest(res, err.name, err.errors);
      }

      const { PaymentGateway } = await PaymentGatewayFactory.getGateway();

      let card_id: string | null = null;
      let use_default = true;
      if (!isNullOrUndefined(req.body.card_id)) {
        card_id = await PaymentGateway.getCardId(user, req.body.card_id, req.body.token_id);
        use_default = false;
      }

      if (!card_id && !use_default && !req.body.token_id) {
        return Controller.badRequest(res, 'Card id not found');
      }

      let discount: Discount = null;
      if (!isNullOrUndefined(req.body.code)) {
        discount = await Discount.findOne({
          where: {
            code: { [Op.iLike]: req.body.code },
            expires_after: { [Op.gt]: new Date() },
          },
        });

        if (!discount) {
          return Controller.badRequest(res, 'El cupón es inválido');
        }

        if (discount.total_uses !== 0) {
          const charges = (await discount.$get('charges', {
            where: {
              status: 'paid',
            },
          })) as Charge[];

          if (charges.length >= discount.total_uses) {
            discount = null;
            return Controller.badRequest(
              res,
              'El cupón ya ha sido usado las veces permitidas',
            );
          }
        }
        if (discount !== null) {
          // We validate if the discount is a special discount from .env file, we need refactor this if this case repeat in the future
          const specialDiscounts = process.env.SPECIAL_DISCOUNT
            ? process.env.SPECIAL_DISCOUNT.split(',')
            : [] || [];
          const specialDiscount = specialDiscounts.find(
            discount_id => Number(discount_id) === discount.id,
          );

          if (specialDiscount !== undefined && plan.new_users_only) {
            return Controller.badRequest(
              res,
              'El cupón no es válido para planes que son para usuarios nuevos. Intenta seleccionando otro plan.',
            );
          }
        }
      }

      if (plan.new_users_only) {
        const previousCharges = await Charge.count({
          where: { plan_name: plan.name, user_id: user.id, status: 'paid' },
        });
        if (previousCharges > 0) {
          return Controller.badRequest(
            res,
            'El plan es válido unicamente para usuarios nuevos.',
          );
        }
      }

      const charge = await PaymentGateway.createCharge(
        user,
        plan,
        card_id,
        discount,
        req.body.card_id ? false : true,
      );

      if (charge.status === 'paid') {
        try {
          user.sendPurchaseEmail(plan);
        } catch (error) {
          // The application couldn't send email
        }
        return Controller.ok(res, null, charge);
      } else {
        try {
          user.sendPurchaseFailureEmail(charge);
        } catch (error) {
          // The application couldn't send email
        }
        return Controller.badRequest(res, 'Pago declinado', charge);
      }
    } catch (error) {
      console.log(error);
      return Controller.serverError(
        res,
        'Ocurrió un problema al realizar tu pago, intenta más tarde.',
        error,
      );
    }
  }

  async paypal(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const user = req.session.user as User;
      const plan = req.session.plan as Plan;

      if (!plan.active) {
        return Controller.badRequest(
          res,
          'Este plan no se encuentra disponible.',
        );
      }

      // todo: validate plans that only work for new users
      // Validate if user has a past reserve
      // Bad request if not new user

      const schema = yup.object().shape({
        order_id: yup.string(),
        code: yup.string(),
      });

      try {
        await validateYup(req.body, schema);
      } catch (err) {
        return Controller.badRequest(res, err.name, err.errors);
      }

      let discount: Discount = null;
      if (!isNullOrUndefined(req.body.code)) {
        discount = await Discount.findOne({
          where: {
            code: { [Op.iLike]: req.body.code },
            expires_after: { [Op.gt]: new Date() },
          },
        });

        if (discount.total_uses !== 0) {
          const charges = (await discount.$get('charges', {
            where: {
              status: 'paid',
            },
          })) as Charge[];

          if (charges.length >= discount.total_uses) {
            discount = null;
          }
        }
      }

      if (plan.new_users_only) {
        const previousCharges = await Charge.count({
          where: { plan_name: plan.name, user_id: user.id, status: 'paid' },
        });
        if (previousCharges > 0) {
          return Controller.badRequest(
            res,
            'El plan es válido unicamente para usuarios nuevos.',
          );
        }
      }

      let paypal_order = null;
      let paypay_auth = null;
      try {
        paypay_auth = await axios.post<any>(
          `${PlanController.PAYPAL_URL}/v1/oauth2/token`,
          PlanController.AUTH_TOKEN_BODY,
          PlanController.AUTH_TOKEN_HEADERS,
        );
        paypal_order = await axios.get<any>(
          `${PlanController.PAYPAL_URL}/v2/checkout/orders/${req.body.order_id}`,
          {
            headers: {
              'Content-type': 'application/json',
              Authorization: `${paypay_auth.data.token_type} ${paypay_auth.data.access_token}`,
            },
          },
        );
      } catch (error) {
        console.log(error);
        return Controller.badRequest(
          res,
          'Ocurrió un error al obtener información de tu método de pago.',
          null,
        );
      }

      const charge = new Charge();
      charge.status = 'paid';

      charge.order_id = paypal_order.data.id;
      charge.currency =
        paypal_order.data.purchase_units[0].amount.currency_code;
      charge.customer_name = `${paypal_order.data.payer.name.given_name} ${paypal_order.data.payer.name.surname}`;
      charge.auth_code = paypal_order.data.id;
      charge.processed_at = new Date(paypal_order.data.create_time);
      charge.paid = Number(paypal_order.data.purchase_units[0].amount.value);
      charge.total_credits = plan.credits;

      charge.payment_method = 'paypal';
      charge.card_type = 'paypal';
      charge.card_brand = 'paypal';
      charge.issuer = '';
      charge.fee = 0;
      charge.card_last4 = '';

      charge.user_id = user.id;
      charge.plan_name = plan.name;
      charge.save();

      if (charge.status === 'paid') {
        try {
          user.sendPurchaseEmail(plan);
        } catch (error) {
          // The application couldn't send email
        }
        return Controller.ok(res, null, charge);
      } else {
        try {
          user.sendPurchaseFailureEmail(charge);
        } catch (error) {
          // The application couldn't send email
        }
        return Controller.badRequest(res, null, charge);
      }
    } catch (error) {
      console.log(error);
      return Controller.serverError(
        res,
        'Ocurrió un problema al realizar tu pago, intenta más tarde.',
        error,
      );
    }
  }

  async pos(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const plan = req.session.plan as Plan;

      const schema = yup.object().shape({
        user_id: yup.number().required(),
        paid: yup.number().nullable(),
        credits: yup.number().nullable(),
        payment_method: yup
          .mixed()
          .required()
          .oneOf(['cash', 'credit-card', 'terminal']),
        auth_code: yup.string().when('payment_method', {
          is: 'credit-card',
          otherwise: yup.string().notRequired(),
        }),
        code: yup.string(),
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

      let discount: Discount = null;
      if (!isNullOrUndefined(req.body.code)) {
        discount = await Discount.findOne({
          where: {
            code: { [Op.iLike]: req.body.code },
            expires_after: { [Op.gt]: new Date() },
          },
        });

        if (discount.total_uses !== 0) {
          const charges = (await discount.$get('charges', {
            where: {
              status: 'paid',
            },
          })) as Charge[];

          if (charges.length >= discount.total_uses) {
            discount = null;
          }
        }
      }

      let total = req.body.paid ? req.body.paid : plan.price;

      if (!isNullOrUndefined(discount)) {
        if (discount.type === 'percentage') {
          total = plan.price * discount.discount;
        } else if (discount.type === 'amount') {
          total = discount.discount;
        }
      }

      const charge = new Charge();
      charge.status = 'paid';

      charge.order_id = '';
      charge.currency = 'MXN';
      charge.customer_name = user.name;
      charge.auth_code = 'No Aplica';
      charge.processed_at = new Date();
      charge.paid = total;
      charge.total_credits = plan.credits;

      charge.payment_method = req.body.payment_method;
      charge.card_type = 'No Aplica';
      charge.card_brand = 'No Aplica';
      charge.issuer = 'No Aplica';
      charge.fee = 0;
      charge.card_last4 = 'No Aplica';

      charge.user_id = user.id;
      charge.plan_name = plan.name;
      charge.save();

      return Controller.created(res, null, plan);
    } catch (err) {
      return Controller.serverError(
        res,
        'Ocurrió un problema al asignar los créditos.',
      );
    }
  }

  private loadPlan() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const plan = await Plan.findByPk(req.params.id);
        if (!plan) {
          return Controller.notFound(res);
        }
        req.session.plan = plan;
        return next();
      } catch (error) {
        return next(error);
      }
    };
  }
}

const controller = new PlanController();
export default controller;
