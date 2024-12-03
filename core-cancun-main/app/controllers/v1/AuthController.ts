import { Controller } from '../../libraries/Controller';
import { User } from '../../models/User';
import { Profile } from '../../models/Profile';
import { JWTBlacklist } from '../../models/JWTBlacklist';
import { Request, Response, Router, NextFunction } from 'express';
import { log } from '../../libraries/Log';
import { config } from '../../config/config';
import { validateJWT } from '../../policies/General';
import mailer from '../../services/EmailService';
import * as _ from 'lodash';
import * as moment from 'moment-timezone';
import * as jwt from 'jsonwebtoken';
import * as uuid from 'uuid';
import { isNullOrUndefined } from 'util';
import { Charge } from '../../models/Charge';
import { addCourtesy } from '../../libraries/util';
import { NewCreditsService } from '../../services/NewCreditsService';

interface Token {
  token: string;
  expires: number;
  expires_in: number;
}

interface Credentials {
  token: Token;
  refresh_token: Token;
  user: User;
  profile: Profile;
}

export class AuthController extends Controller {
  constructor() {
    super();
    this.name = 'auth';
  }

  routes(): Router {
    this.router.post(
      '/login',
      (req: Request, res: Response, next: NextFunction) =>
        this.login(req, res, next),
    );

    this.router.post(
      '/logout',
      validateJWT('access'),
      (req: Request, res: Response, next: NextFunction) =>
        this.logout(req, res, next),
    );

    this.router.post(
      '/register',
      (req: Request, res: Response, next: NextFunction) =>
        this.register(req, res, next),
    );

    this.router.get(
      '/reset',
      (req: Request, res: Response, next: NextFunction) =>
        this.resetGet(req, res, next),
    );

    this.router.post(
      '/reset',
      (req: Request, res: Response, next: NextFunction) =>
        this.resetPost(req, res, next),
    );

    this.router.post(
      '/change',
      validateJWT('access'),
      (req: Request, res: Response, next: NextFunction) =>
        this.changePassword(req, res, next),
    );

    this.router.post(
      '/refresh',
      validateJWT('refresh'),
      (req: Request, res: Response, next: NextFunction) =>
        this.refreshToken(req, res, next),
    );

    return this.router;
  }

  public createToken(user: any, type: string): Token {
    let expiryUnit: any = config.jwt[type].expiry.unit;
    let expiryLength = config.jwt[type].expiry.length;
    let expires = moment()
      .add(expiryLength, expiryUnit)
      .valueOf();
    let issued = Date.now();
    let expires_in = (expires - issued) / 1000; // seconds

    let token = jwt.sign(
      {
        id: user.id,
        sub: config.jwt[type].subject,
        aud: config.jwt[type].audience,
        exp: expires,
        iat: issued,
        jti: uuid.v4(),
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
      },
      config.jwt.secret,
    );

    return {
      token: token,
      expires: expires,
      expires_in: expires_in,
    };
  }

  protected getCredentials(user: User, profile: Profile): Credentials {
    // Prepare response object
    const token = this.createToken(user, 'access');
    const refreshToken = this.createToken(user, 'refresh');

    const plain_user: any = user.get({ plain: true });
    plain_user.profile = profile.get({ plain: true });

    return {
      token: token,
      refresh_token: refreshToken,
      user: plain_user,
      profile: profile,
    };
  }

  private async sendEmailWelcome(user: User): Promise<any> {
    const subject = '¡Bienvenid@ a We Active Tribe!';

    const info = await mailer.sendEmail({
      email: user.email,
      page: 'new_account',
      locale: user.profile.locale || 'es',
      context: {
        name: user.name,
      },
      subject,
    });

    log.debug('Sending password recovery email to:', user.email, info);

    return info;
  }

  private async sendEmailNewPassword(
    user: User,
    token: string,
    name: string = user.email,
  ): Promise<any> {
    const subject = 'Instructions for restoring your password';

    const info = await mailer.sendEmail({
      email: user.email,
      page: 'password_recovery',
      locale: user.profile.locale,
      context: {
        url: `${process.env.CLIENT_URL}/recovery_password?token=${token}`,
        name,
      },
      subject,
    });

    log.debug('Sending password recovery email to:', user.email, info);

    return info;
  }

  private async sendEmailPasswordChanged(
    user: User,
    name: string = user.email,
  ): Promise<any> {
    const subject = 'Password restored';

    const info = await mailer.sendEmail({
      email: user.email,
      page: 'password_changed',
      locale: user.profile.locale,
      context: { name },
      subject,
    });

    log.debug('Sending password changed email to:', user.email, info);
    return info;
  }

  private async handleResetEmail(email: string): Promise<any> {
    const user = await User.findOne({
      where: { email: email },
      include: [{ model: Profile }],
    });
    if (!user) {
      throw { error: 'notFound', msg: 'Email not found' };
    }

    // Create reset token
    let token = this.createToken(user, 'reset');
    return this.sendEmailNewPassword(user, token.token, user.name);
  }

  private async handleResetChPass(
    token: string,
    password: string,
  ): Promise<Credentials> {
    const decodedjwt = await this.validateJWT(token, 'reset');

    if (!decodedjwt) {
      throw { error: 'unauthorized', msg: 'Invalid Token' };
    }

    let user = await User.findOne({
      where: { id: decodedjwt.id },
      include: [Profile],
    });

    if (!user) {
      throw { error: 'unauthorized' };
    }

    user.password = password;

    try {
      user = await user.save();
      if (!user) {
        throw { error: 'serverError', msg: null };
      }
    } catch (err) {
      log.error(err);
      throw err;
    }

    try {
      await JWTBlacklist.create({
        token: token,
        expires: decodedjwt.exp,
      });
    } catch (err) {
      log.error(err);
    }

    try {
      await this.sendEmailPasswordChanged(user);
    } catch (err) {
      log.error(err);
    }

    const profile = (await user.$get('profile')) as Profile;

    return this.getCredentials(user, profile);
  }

  public async validateJWT(token: string, type: string): Promise<any> {
    // Decode token
    const decodedjwt: any = jwt.verify(token, config.jwt.secret);
    const reqTime = Date.now();

    // moment dates

    const expDate = moment(decodedjwt.exp);
    const now = moment();
    const daysDifference = expDate.diff(now, 'days');

    // Check if token expired
    if (
      decodedjwt.exp <= reqTime &&
      !(
        daysDifference >= 0 &&
        daysDifference <= config.jwt.max_valid_days_after_exp
      )
    ) {
      throw new Error('Token expired');
    }
    // Check if token is early
    if (!isNullOrUndefined(decodedjwt.nbf) && reqTime <= decodedjwt.nbf) {
      throw new Error('This token is early.');
    }

    // If audience doesn't match
    if (config.jwt[type].audience !== decodedjwt.aud) {
      throw new Error('This token cannot be accepted for this domain.');
    }

    // If the subject doesn't match
    if (config.jwt[type].subject !== decodedjwt.sub) {
      throw new Error('This token cannot be used for this request.');
    }

    const jwtblacklist = await JWTBlacklist.findOne({
      where: { token: token },
    });

    if (jwtblacklist != null) {
      throw new Error('This Token is blacklisted.');
    }

    return decodedjwt;
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const email = (req.body.email as string).toLowerCase();
      const password = req.body.password;
      // Validate
      if (email == null || password == null) {
        return Controller.badRequest(res);
      }

      const user = await User.findOne({
        where: { email: email },
        include: [{ model: Profile }],
      });

      if (user && (await user.authenticate(password))) {
        const profile = (await user.$get('profile')) as Profile;
        let credentials = this.getCredentials(user, profile);

        return Controller.ok(res, null, credentials);
      } else {
        return Controller.unauthorized(res);
      }
    } catch (err) {
      return next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      let token = req.session.jwtstring;
      let decodedjwt = req.session.jwt;

      if (isNullOrUndefined(token) || isNullOrUndefined(decodedjwt)) {
        return Controller.unauthorized(res);
      }

      // Put token in blacklist
      const jwt = await JWTBlacklist.create({
        token: token,
        expires: decodedjwt.exp,
      });

      return Controller.ok(res);
    } catch (err) {
      return next(err);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      // Refresh token has been previously authenticated in validateJwt as refresh token
      let refreshToken: string = req.session.jwtstring;
      let decodedjwt: any = req.session.jwt;
      let reqUser: User = req.session.user;

      // Put refresh token in blacklist
      const result = await JWTBlacklist.create({
        token: refreshToken,
        expires: decodedjwt.exp,
      });

      const user = await User.findOne({ where: { id: reqUser.id } });

      if (!user) {
        return Controller.unauthorized(res);
      }

      // Create new token and refresh token and send
      const profile = (await user.$get('profile')) as Profile;
      const credentials: Credentials = this.getCredentials(user, profile);

      return Controller.ok(res, null, credentials);
    } catch (err) {
      return next(err);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      let newUser = {
        email: (req.body.email as string).toLowerCase(),
        password: req.body.password,
        name: req.body.name,
        last_name: req.body.last_name,
      };

      // Optional extra params:
      let locale: string | undefined = req.body.locale;
      let timezone: string | undefined = req.body.timezone;
      let phone: string | undefined = req.body.phone;
      let emergency_contact: string | undefined = req.body.emergency_contact;
      let emergency_contact_name: string | undefined =
        req.body.emergency_contact_name;

      // Validate
      if (
        isNullOrUndefined(newUser.email) ||
        newUser.email == '' ||
        isNullOrUndefined(newUser.password) ||
        newUser.password == '' ||
        isNullOrUndefined(newUser.name) ||
        newUser.name == '' ||
        isNullOrUndefined(newUser.last_name) ||
        newUser.last_name == '' ||
        isNullOrUndefined(phone) ||
        phone == '' ||
        isNullOrUndefined(emergency_contact) ||
        emergency_contact == '' ||
        isNullOrUndefined(emergency_contact_name) ||
        emergency_contact_name == ''
      ) {
        return Controller.badRequest(res);
      }

      let user: User;
      try {
        user = await User.create(newUser);
        await NewCreditsService.call(user);
      } catch (err) {
        if (
          err.errors != null &&
          err.errors.length &&
          err.errors[0].type === 'unique violation' &&
          err.errors[0].path === 'email'
        ) {
          return Controller.badRequest(
            res,
            'Ya existe un usuario con el correo electrónico indicado.',
          );
        }

        throw err;
      }

      let profile = (await user.$get('profile')) as Profile;

      if (!isNullOrUndefined(locale)) {
        profile.locale = locale;
      }

      if (!isNullOrUndefined(locale)) {
        profile.time_zone = timezone;
      }

      if (!isNullOrUndefined(phone)) {
        profile.phone = phone;
      }

      if (!isNullOrUndefined(emergency_contact)) {
        profile.emergency_contact = emergency_contact;
      }

      if (!isNullOrUndefined(emergency_contact_name)) {
        profile.emergency_contact_name = emergency_contact_name;
      }

      profile = await profile.save();

      const credentials = this.getCredentials(user, profile);

      // Attatch the profile object to the user for email handler proporses
      user.profile = profile;
      // Sending the welcome email
      await this.sendEmailWelcome(user);
      return Controller.ok(res, null, credentials);
    } catch (err) {
      return next(err);
    }
  }

  /*
    This can serve two different use cases:
      1. Request sending of recovery token via email (body: { email: '...' })
      2. Set new password (body: { token: 'mytoken', password: 'newpassword' })
  */
  async resetPost(req: Request, res: Response, next: NextFunction) {
    try {
      const token: string = req.body.token,
        password: string = req.body.password;
      let email = null;

      if (req.body.email) {
        email = (req.body.email as string).toLowerCase();
      }
      // Validate if case 2
      if (!isNullOrUndefined(token) && !isNullOrUndefined(password)) {
        const credentials = await this.handleResetChPass(token, password);
        return Controller.ok(res, null, credentials);
      }

      // Validate case 1
      if (!isNullOrUndefined(email)) {
        const info = this.handleResetEmail(email);
        log.info(info);
        return Controller.ok(res);
      }

      return Controller.badRequest(res);
    } catch (err) {
      return next(err);
    }
  }

  async resetGet(req: Request, res: Response, next: NextFunction) {
    try {
      let token: any = req.query.token;
      if (isNullOrUndefined(token)) {
        return Controller.unauthorized(res);
      }
      // Decode token
      const decodedjwt = await this.validateJWT(token, 'reset');
      if (decodedjwt) {
        return Controller.redirect(
          res,
          `${config.urls.base}/recovery/#/reset?token=${token}`,
        );
      } else {
        return Controller.unauthorized(res);
      }
    } catch (error) {
      return next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      let oldPass = req.body.oldPass;
      let newPass = req.body.newPass;
      // Validate
      if (isNullOrUndefined(oldPass) || isNullOrUndefined(newPass)) {
        return Controller.badRequest(res);
      }

      let user = req.session.user as User;

      if (user && (await user.authenticate(oldPass))) {
        user.password = newPass;
        user = await user.save();
        const profile = (await user.$get('profile')) as Profile;
        const credentials = this.getCredentials(user, profile);
        return Controller.ok(res, null, credentials);
      } else {
        return Controller.unauthorized(res);
      }
    } catch (error) {
      return next(error);
    }
  }
}

const controller = new AuthController();
export default controller;
