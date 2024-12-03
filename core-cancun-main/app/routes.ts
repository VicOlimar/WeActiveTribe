import {
  Application,
  static as Static,
  Request,
  Response,
  Router,
} from 'express';
import * as path from 'path';
import { log } from './libraries/Log';
import AuthController from './controllers/v1/AuthController';
import UserController from './controllers/v1/UserController';
import StudioController from './controllers/v1/StudioController';
import ReserveController from './controllers/v1/ReserveController';
import CardController from './controllers/v1/CardController';
import PlanController from './controllers/v1/PlanController';
import WaitingController from './controllers/v1/WaitingController';
import InstructorController from './controllers/v1/InstructorController';
import ChargesController from './controllers/v1/ChargesController';
import DiscountController from './controllers/v1/DiscountController';
import LessonController from './controllers/v1/LessonController';
import BlockPlaceController from './controllers/v1/BlockPlaceController';
import NotificationsController from './controllers/v1/NotificationsController';
import LessonTypeController from './controllers/v1/LessonTypeController';
import SettingController from './controllers/v1/SettingController';
import { middleware } from './bugsnag';

const apiV1 = (): Router => {
  const router = Router();

  router.use(`/${AuthController.name}`, AuthController.routes());
  router.use(`/${UserController.name}`, UserController.routes());
  router.use(`/${StudioController.name}`, StudioController.routes());
  router.use(`/${CardController.name}`, CardController.routes());
  router.use(`/${PlanController.name}`, PlanController.routes());
  router.use(`/${ReserveController.name}`, ReserveController.routes());
  router.use(`/${WaitingController.name}`, WaitingController.routes());
  router.use(`/${InstructorController.name}`, InstructorController.routes());
  router.use(`/${ChargesController.name}`, ChargesController.routes());
  router.use(`/${DiscountController.name}`, DiscountController.routes());
  router.use(`/${LessonController.name}`, LessonController.routes());
  router.use(`/${BlockPlaceController.name}`, BlockPlaceController.routes());
  router.use(
    `/${NotificationsController.name}`,
    NotificationsController.routes(),
  );
  router.use(`/${LessonTypeController.name}`, LessonTypeController.routes());
  router.use(`/${SettingController.name}`, SettingController.routes());

  return router;
};

export function routes(app: Application) {
  app.use('/api/v1/', apiV1());

  app.use(Static(path.join(__dirname, '../public')));

  app.get('/*', (req: Request, res: Response) => {
    return res.status(405).send({
      status: 405,
      message: req.__('method_not_allowed'),
    });
  });

  app.post('/*', (req: Request, res: Response) => {
    return res.status(405).send({
      status: 405,
      message: req.__('method_not_allowed'),
    });
  });

  app.use(middleware.errorHandler);

  app.use((err, req, res, next) => {
    log.error(err);
    console.log(err);
    return res.status(500).send({
      status: 500,
      message: req.__('server_error'),
    });
  });
}
