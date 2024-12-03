import { Controller } from '../../libraries/Controller';
import { Request, Response, Router, NextFunction } from 'express';
import * as yup from 'yup';
import { validateJWT, onlyLogged } from '../../policies/General';
import { User } from '../../models/User';
import { log } from '../../libraries/Log';
import { Conekta, Customer, CustomerActionable } from '../../libraries/Conekta';
import { validateYup } from '../../libraries/util';

export class CardController extends Controller {
  constructor() {
    super();
    this.name = 'card';
  }

  routes(): Router {
    this.router.get(
      '/',
      validateJWT('access'),
      onlyLogged(),
      (req: Request, res: Response, next: NextFunction) =>
        this.find(req, res, next),
    );

    this.router.post(
      '/',
      validateJWT('access'),
      onlyLogged(),
      (req: Request, res: Response, next: NextFunction) =>
        this.create(req, res, next),
    );

    this.router.delete(
      '/',
      validateJWT('access'),
      onlyLogged(),
      (req: Request, res: Response, next: NextFunction) =>
        this.delete(req, res, next),
    );

    this.router.put(
      '/default',
      validateJWT('access'),
      onlyLogged(),
      (req: Request, res: Response, next: NextFunction) =>
        this.changeDefault(req, res, next),
    );

    return this.router;
  }

  async find(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.session.user as User;
      const cards = await Conekta.getCards(user);

      return Controller.ok(res, null, cards);
    } catch (err) {
      return next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.session.user as User;

      const schema = yup.object().shape({
        token_id: yup.string().required(),
      });

      try {
        await validateYup(req.body, schema);
      } catch (err) {
        return Controller.badRequest(res, err.name, err.errors);
      }

      try {
        await Conekta.addCard(user, req.body.token_id);
        return Controller.created(res);
      } catch (err) {
        if (err.name === 'Card id not found') {
          return Controller.badRequest(res);
        }
        throw err;
      }
    } catch (err) {
      return next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const user: User = req.session.user;

      const schema = yup.object().shape({
        card_id: yup.string().required(),
      });

      try {
        await validateYup(req.body, schema);
      } catch (err) {
        return Controller.badRequest(res, err.name, err.errors);
      }

      try {
        const response = await Conekta.deleteCard(user, req.body.card_id);
        if (!response) {
          throw new Error('Unable to delete card');
        }
      } catch (err) {
        if (err.name === 'Card id not found') {
          return Controller.badRequest(res, "card_id it's not valid");
        }
        throw err;
      }

      return Controller.noContent(res);
    } catch (err) {
      return next(err);
    }
  }

  async changeDefault(req: Request, res: Response, next: NextFunction) {
    try {
      const user: User = req.session.user;

      const schema = yup.object().shape({
        card_id: yup.string().required(),
      });

      try {
        await validateYup(req.body, schema);
      } catch (err) {
        return Controller.badRequest(res, err.name, err.errors);
      }

      try {
        await Conekta.defaultCard(user, req.body.card_id);
      } catch (err) {
        if (err.type === 'Card id not found') {
          return Controller.badRequest(res, "card_id it's not valid");
        }
        throw err;
      }

      return Controller.ok(res);
    } catch (err) {
      return next(err);
    }
  }
}

const controller = new CardController();
export default controller;
