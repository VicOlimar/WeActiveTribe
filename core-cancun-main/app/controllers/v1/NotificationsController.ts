import { Controller } from '../../libraries/Controller';
import { FindAndCountOptions, Op } from 'sequelize';
import { Request, Response, Router, NextFunction } from 'express';
import { validateJWT, onlyLogged } from '../../policies/General';
import { validateYup } from '../../libraries/util';
import { User } from '../../models/User';
import { Profile } from '../../models/Profile';
import { Notification } from '../../models/Notification';
import * as yup from 'yup';
import * as moment from 'moment';

const DAYS_LIMIT_NOTIFICATION = 30;

export class NotificationsController extends Controller {
  constructor() {
    super();
    this.name = 'notifications';
  }

  routes(): Router {
    this.router.get(
      '/',
      validateJWT('access'),
      onlyLogged(),
      (req: Request, res: Response, next: NextFunction) => {
        this.find(req, res, next);
      },
    );
    this.router.post(
      '/',
      validateJWT('access'),
      onlyLogged(),
      (req: Request, res: Response, next: NextFunction) => {
        this.create(req, res, next);
      },
    );
    return this.router;
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = yup.object().shape({
        title: yup.string().required(),
        content: yup.string().required(),
        users: yup.array(),
        subtitle: yup.string(),
      });
      try {
        await validateYup(req.body, schema);
      } catch (err) {
        return Controller.badRequest(res, err.name, err.errors);
      }

      const { title, subtitle, content, users } = req.body;
      let usersToNotify = [];

      if (users.length === 0) {
        usersToNotify = await User.findAll({
          include: [{ model: Profile }],
        });
      } else {
        usersToNotify = await User.findAll({
          include: [{ model: Profile }],
          where: {
            id: users,
          },
        });
      }
      usersToNotify = await usersToNotify.filter(
        user => user.profile && user.profile.notifications,
      );

      await usersToNotify.forEach(async (user: User) => {
        try {
          const notification_api = await user.sendPushNotification(
            title,
            subtitle,
            content,
          );
          const { id } = notification_api.data;

          await Notification.create({
            content: content,
            title: title,
            subtitle: subtitle,
            api_id: id,
            user_id: user.id,
          });
        } catch (error) {
          if (error.response) {
            console.log(error.response.data.errors, 'ONE SIGNAL ERROR');
          } else {
            console.log(error, 'ONE SIGNAL ERROR TWO');
          }
        }
      });
      Controller.created(res, null, {});
    } catch (error) {
      return next(error);
    }
  };

  async find(req: Request, res: Response, next: NextFunction): Promise<any> {
    let notifications: Notification[];
    const created_at_limit = moment()
      .subtract(DAYS_LIMIT_NOTIFICATION, 'days')
      .toDate();

    try {
      const user_id = req.query ? req.query.user_id : null;
      const query: FindAndCountOptions = {
        order: [['created_at', 'DESC']],
        where: {
          created_at: { [Op.gte]: created_at_limit },
        },
        attributes: {
          exclude: ['updated_at', 'deleted_at'],
        },
      };

      if (user_id) {
        query.where['user_id'] = user_id;
      }

      notifications = await Notification.findAll(query);

      return Controller.ok(res, null, notifications);
    } catch (error) {
      return next(error);
    }
  }
}

const controller = new NotificationsController();

export default controller;
