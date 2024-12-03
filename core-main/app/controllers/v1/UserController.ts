import { Controller } from '../../libraries/Controller';
import { User } from '../../models/User';
import { Request, Response, Router, NextFunction } from 'express';
import { validateJWT, filterRoles, onlyLogged } from '../../policies/General';
import { Profile } from '../../models/Profile';
import { Op, FindOptions, FindAndCountOptions, WhereOptions, Order } from 'sequelize';
import * as moment from 'moment';
import * as yup from 'yup';
import { Lesson } from '../../models/Lesson';
import { validateYup, perPage, sort, useACredit, useACreditV2, pausedValidity, reactivatedValidity } from '../../libraries/util';
import { Reserve } from '../../models/Reserve';
import { Credit } from '../../models/Credit';
import { OnlineCredit } from '../../models/OnlineCredit';
import { LessonType } from '../../models/LessonType';
import { Studio } from '../../models/Studio';
import { CreditKeys, groupTypeCredit } from '../utils/credits';


export class UserController extends Controller {
  constructor() {
    super();
    this.name = 'user';
  }

  routes(): Router {
    this.router.get(
      '/me',
      validateJWT('access'),
      onlyLogged(),
      (req: Request, res: Response, next: NextFunction) =>
        this.findMe(req, res, next),
    );

    this.router.get(
      '/',
      validateJWT('access'),
      filterRoles(['admin']),
      onlyLogged(),
      (req: Request, res: Response, next: NextFunction) =>
        this.find(req, res, next),
    );

    this.router.get(
      '/:id',
      validateJWT('access'),
      filterRoles(['admin']),
      onlyLogged(),
      this.loadUser(),
      (req: Request, res: Response, next: NextFunction) =>
        this.findOne(req, res, next)
    );

    this.router.post(
      '/me',
      validateJWT('access'),
      onlyLogged(),
      (req: Request, res: Response, next: NextFunction) =>
        this.updateMe(req, res, next),
    );

    this.router.post(
      '/:id/status',
      validateJWT('access'),
      filterRoles(['admin']),
      onlyLogged(),
      this.loadUser(),
      (req: Request, res: Response, next: NextFunction) =>
        this.status(req, res, next),
    );

    this.router.get(
      '/:id/pause',
      validateJWT('access'),
      filterRoles(['admin']),
      onlyLogged(),
      this.loadUser(),
      (req: Request, res: Response, next: NextFunction) =>
        this.pauseValidity(req, res, next)
    );

    this.router.get(
      '/:id/reactivate',
      validateJWT('access'),
      filterRoles(['admin']),
      onlyLogged(),
      this.loadUser(),
      (req: Request, res: Response, next: NextFunction) =>
        this.reactivateValidity(req, res, next)
    );

    this.router.get(
      '/:id/credit',
      validateJWT('access'),
      filterRoles(['admin']),
      onlyLogged(),
      this.loadUser(),
      (req: Request, res: Response, next: NextFunction) =>
        this.getCreditsDetail(req, res, next)
    );


    this.router.post(
      '/:id/credit',
      validateJWT('access'),
      filterRoles(['admin']),
      onlyLogged(),
      this.loadUser(),
      (req: Request, res: Response, next: NextFunction) =>
        this.reduceCredit(req, res, next),
    );

    return this.router;
  }

  async findOne(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const user = req.session.user as User;
      const available = await user.$count('available_credits');
      const available_data = await user.$get('available_credits', { include: [LessonType, Studio] });
      const available_online = await user.$count('available_online_credits');
      const available_online_data = await user.$get('available_online_credits', { include: [LessonType, Studio] });
      const to_expire = await user.$count('expiring_credits');
      const online_to_expire = await user.$count('expiring_online_credits');

      const credits = {
        to_expire,
        online_to_expire,
        available,
        available_online,
        available_data,
        available_online_data
      };

      if (!user) {
        return Controller.notFound(res, 'Usuario no encontrado.')
      }
      return Controller.ok(res, null, {user, credits})
    } catch (error) {
      return next(error);
    }
  }

  async find(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { limit, offset } = perPage(req.query.per_page, req.query.page);
      const order: Order = sort(req.query.sort);

      const query: FindAndCountOptions = {
        order,
        limit,
        offset,
        attributes: {
          exclude: ['updated_at', 'deleted_at', 'avatar_id', 'password'],
        },
        include: [
          { model: Credit, as: 'available_credits' },
          { model: OnlineCredit, as: 'available_online_credits' },
          { model: Profile }],
      }

      if (req.session.user.role === 'admin') {
        if (req.query.search) {
          if (!query.where) {
            query.where = { [Op.or]: [] };
          }
          query.where[Op.or].push({ email: { [Op.iLike]: `%${req.query.search}%` } });
          query.where[Op.or].push({ name: { [Op.iLike]: `%${req.query.search}%` } });
        }
      }

      const users = await User.findAll(query);
      const usersCount = await User.count({ where: query.where });

      const usersResult: any = users.map(user => {
        const plain: any = user.get({ plain: true });
        // plain.used_credits = user.used_credits.length;
        plain.available_credits = user.available_credits.length;
        plain.available_online_credits = user.available_online_credits.length;
        //plain.reserves = user.reserved_lessons.length;
        //plain.charge = user.charges.reduce((initial: number, charge: Charge) => Number(initial) + Number(charge.paid), 0);
        delete plain.reserved_lessons;
        delete plain.charges;
        return plain;
      });

      return Controller.ok(res, null, usersResult, usersCount);
    } catch (error) {
      return next(error);
    }
  }

  async findMe(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const user: User = req.session.user;
      const profile: Profile = (await user.$get('profile')) as Profile;

      // We need run a query for get all next reservations and count it
      const query: FindAndCountOptions = {
        include: [{
          model: Lesson,
          where: { ends_at: { [Op.gte]: moment().utc() } }
        }],
        where: {
          canceled: false,
          user_id: user.id,
        }
      };
      const reserves = await Reserve.findAndCountAll(query);

      const available = await user.$count('available_credits');
      const available_data = await user.$get('available_credits', { include: [LessonType, Studio] });
      const available_online = await user.$count('available_online_credits');
      const available_online_data = await user.$get('available_online_credits', { include: [LessonType, Studio] });
      const to_expire = await user.$count('expiring_credits');
      const online_to_expire = await user.$count('expiring_online_credits');

      const credits = {
        to_expire,
        online_to_expire,
        available,
        available_online,
        available_data,
        available_online_data
      };

      return Controller.ok(res, null, { user, profile, credits, reserves: { next_reserves: reserves.count } });
    } catch (error) {
      return next(error);
    }
  }

  async updateMe(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      let user: User = req.session.user as User;
      let profile: Profile = (await user.$get('profile')) as Profile;

      //based on: https://www.sitepoint.com/community/t/phone-number-regular-expression-validation/2204
      const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

      const schema = yup.object().shape({
        user: yup.object().shape({
          name: yup.string(),
          last_name: yup.string(),
          email: yup.string().email(),
          birthdate: yup.date(),
          emergency_contact: yup.string(),
        }),
        profile: yup.object().shape({
          time_zone: yup.string(),
          phone: yup.string().matches(phoneRegExp),
          locale: yup.mixed().oneOf(Profile.LOCALES),
          notifications: yup.boolean(),
        }),
      });

      try {
        await validateYup(req.body, schema);
      } catch (err) {
        return Controller.badRequest(res, err.name, err.errors);
      }

      if (req.body.user) {
        if (req.body.user.name) {
          user.name = req.body.user.name;
        }
        if (req.body.user.last_name) {
          user.last_name = req.body.user.last_name;
        }
        if (req.body.user.email) {
          user.email = req.body.user.email;
        }
        user = await user.save();
      }

      if (req.body.profile) {
        if (req.body.profile.time_zone) {
          profile.time_zone = req.body.profile.time_zone;
        }
        if (req.body.profile.locale) {
          profile.locale = req.body.profile.locale;
        }
        if (req.body.profile.phone) {
          profile.phone = req.body.profile.phone;
        }
        if (req.body.profile.birthdate) {
          profile.birthdate = req.body.profile.birthdate;
        }
        if (req.body.profile.emergency_contact) {
          profile.emergency_contact = req.body.profile.emergency_contact;
        }
        if (req.body.profile.emergency_contact_name) {
          profile.emergency_contact_name = req.body.profile.emergency_contact_name;
        }

        profile.notifications = req.body.profile.notifications || false;

        profile = await profile.save();
      }

      return Controller.ok(res, null, { user, profile });
    } catch (error) {
      return next(error);
    }
  }

  async status(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const user: User = req.session.user;

      const schema = yup.object().shape({
        active: yup.boolean().required()
      });

      try {
        await validateYup(req.body, schema);
      } catch (err) {
        return Controller.badRequest(res, err.name, err.errors);
      }

      user.active = req.body.active || false;

      await user.save();
      return Controller.ok(res, null, user);
    } catch (error) {
      return next(error);
    }
  }

  async reduceCredit(req: Request, res: Response, next: NextFunction) {
    try {
      const user: User = req.session.user;

      const schema = yup.object().shape({
        type: yup.mixed().required().oneOf(['online', 'classic'])
      });

      try {
        await validateYup(req.body, schema);
      } catch (err) {
        return Controller.badRequest(res, err.name, err.errors);
      }
      const credit: Credit | OnlineCredit = req.body.typeLesson
        ? await useACreditV2(user.id, req.body.type, req.body.typeLesson)
        : await useACredit(user.id, req.body.type);
      if (credit) {
        return Controller.ok(res, null, user);
      } else return Controller.serverError(res, 'No se pudo restar el crédito');
    } catch (error) {
      return next(error);
    }
  }

  async pauseValidity(req: Request, res: Response, next: NextFunction) {
    try {
      const user: User = req.session.user;
      if (user.available_credits.length > 0 || user.available_online_credits.length > 0) {
        await pausedValidity(user.available_credits, user.available_online_credits)

        user.pause = true
        await user.save()
        return Controller.ok(res, null, user)
      }
      return Controller.ok(res, 'El usuario no tiene credtiros para pausar', null)
    } catch (error) {
      return next(error)
    }
  }

  async reactivateValidity(req: Request, res: Response, next: NextFunction) {
    try {
      const user: User = req.session.user;

      const credit = await reactivatedValidity(user.id)

      if (credit) {
        user.pause = false
        await user.save()
        return Controller.ok(res, null, user)
      }
      return Controller.ok(res, 'El usuairo no tiene creditos para reactivar', null)
    } catch (error) {
      return next(error)
    }
  }

  async getCreditsDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const user: User = req.session.user;
      const available_data = await user.$get('available_credits', { include: [LessonType, Studio] }) as  Credit[];
      
      const keyGroupCreditsDetail: CreditKeys[] = [
        'lesson_type_id',
        'expires_at',
        'validity',
        'paused',
      ];
      const creditsDetail = groupTypeCredit(available_data, keyGroupCreditsDetail)

      return  Controller.ok(res, null, creditsDetail)
    } catch (error) {
      return next(error)
    }
  }
  
  private loadUser() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = await User.findByPk(req.params.id, {
          attributes: {
            exclude: ['updated_at', 'deleted_at', 'avatar_id', 'password'],
          },
          include: [
            { model: Credit, as: 'available_credits' },
            { model: OnlineCredit, as: 'available_online_credits' }
          ]
        });
        if (!user) {
          return Controller.notFound(res);
        }
        /*         const plain: any = user.get({ plain: true });
                plain.available_credits = user.available_credits.length; */
        req.session.user = user;
        return next();
      } catch (error) {
        return next(error);
      }
    };
  }
}

const controller = new UserController();
export default controller;

