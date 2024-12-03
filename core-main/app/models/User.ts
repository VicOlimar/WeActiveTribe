import {
  Table,
  Column,
  HasOne,
  DataType,
  BeforeBulkCreate,
  BeforeCreate,
  AfterCreate,
  BeforeUpdate,
  BeforeBulkUpdate,
  BeforeDestroy,
  Model,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { Profile } from './Profile';
import * as bcrypt from 'bcrypt';
import { Charge } from './Charge';
import { Credit } from './Credit';
import { Reserve } from './Reserve';
import { Lesson } from './Lesson';
import { Op } from 'sequelize';
import { Conekta, CustomerActionable, Customer } from '../libraries/Conekta';
import { isNullOrUndefined } from 'util';
import mailer from '../services/EmailService';
import { log } from '../libraries/Log';
import { Plan } from './Plan';
import * as moment from 'moment';
import { config } from '../config/config';
const Mailchimp = require('mailchimp-api-v3');
import axios from 'axios';
import { OnlineCredit } from './OnlineCredit';
import { Studio } from './Studio';

const mailchimp = new Mailchimp(config.mailchimp.apiKey);

type OneSignalResponse = {
  id: string;
  recipients: number;
  external_id: string | null;
}

@Table
export class User extends Model<User> {

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  last_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isLength: {
        min: 8,
      },
    },
  })
  password: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: null,
  })
  password_change_date: Date;

  @Column({
    type: DataType.ENUM('user', 'admin'),
    allowNull: false,
    defaultValue: 'user',
  })
  role: 'user' | 'admin';

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  active: boolean;
  
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  pause: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  last_contact_date: Date;

  @HasOne(() => Profile, {
    hooks: true,
    onDelete: 'CASCADE',
  })
  profile: Profile;

  @HasMany(() => Charge)
  charges: Charge[];

  @HasMany(() => Credit)
  credits: Credit[];

  @HasMany(() => OnlineCredit)
  online_credits: OnlineCredit[];

  @HasMany(() => Credit, {
    scope: { used: true, canceled: false },
  })
  used_credits: Credit[];

  @HasMany(() => Credit, {
    scope: { canceled: true },
  })
  canceled_credits: Credit[];

  @HasMany(() => Credit, {
    scope: { used: false, canceled: false, expires_at: { [Op.gt]: new Date() } },
  })
  available_credits: Credit[];

  @HasMany(() => OnlineCredit, {
    scope: { used: false, canceled: false, expires_at: { [Op.gt]: new Date() } },
  })
  available_online_credits: OnlineCredit[];

  @HasMany(() => Credit, {
    scope: { used: false, expires_at: { [Op.between]: [new Date(), moment().endOf('month').toDate()] } },
  })
  expiring_credits: Credit[];

  @HasMany(() => OnlineCredit, {
    scope: { used: false, expires_at: { [Op.between]: [new Date(), moment().endOf('month').toDate()] } },
  })
  expiring_online_credits: OnlineCredit[];

  @BelongsToMany(() => Lesson, {
    through: {
      model: () => Reserve,
      scope: {
        canceled: false,
      },
    },
  })
  reserved_lessons: Array<Lesson & { reserve: Reserve }>;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BeforeBulkCreate
  @BeforeBulkUpdate
  static activateIndividualHooks(items: User[], options: any) {
    options.individualHooks = true;
  }

  @BeforeCreate
  static async addPassword(user: User, options: any) {
    return await user.updatePassword();
  }

  @AfterCreate
  static async createProfile(user: User, options: any) {
    await user.addProfile();
    await user.createCustomer();
    if (config.mailchimp.apiKey && config.mailchimp.list_id) {
      await user.mailchimpRegister();
    }
  }

  @BeforeUpdate
  static async changePassword(user: User, options: any) {
    if (user.changed('password')) {
      return await user.updatePassword();
    }
    return;
  }

  @BeforeDestroy
  static async deleteChilds(user: User, options: any) {
    return Promise.all([Profile.destroy({ where: { user_id: user.id } })]);
  }

  toJSON() {
    const instance: any = super.toJSON();

    delete instance.created_at;
    delete instance.updated_at;
    delete instance.deleted_at;
    delete instance.password;

    return instance;
  }

  async authenticate(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  async hashPassword(password: string): Promise<string> {
    if (password == null || password.length < 8)
      throw new Error('Invalid password');
    return await bcrypt.hash(password, 10);
  }

  async updatePassword() {
    const result = await this.hashPassword(this.password);
    this.password = result;
    this.password_change_date = new Date();
  }

  async addProfile(): Promise<Profile> {
    const profile = await Profile.create({
      time_zone: 'America/Mexico_City',
      user_id: this.id,
      locale: 'es', // Defaults, this should be changed in auth controller on register.
    });

    return profile;
  }

  async createCustomer(): Promise<string> {
    const profile = (await this.$get('profile')) as Profile;
    const client_id = await Conekta.createCustomer(this);

    profile.payment_key = client_id;
    await profile.save();
    return client_id;
  }

  async mailchimpRegister(): Promise<string> {
    try {
      const response = await mailchimp.post(`/lists/${config.mailchimp.list_id}/members`, {
        email_address: this.email,
        status: 'subscribed'
      });
      return response;
    } catch (error) {
      log.debug('User already exist on the mailchimp list', this.email, {});
    }
  }

  async updateCustomer(): Promise<string> {
    const customer = await Conekta.updateCustomer(this);
    return customer.toObject().id;
  }

  async getCustomer(plain = false): Promise<CustomerActionable | Customer> {
    try {
      const customer = await Conekta.findCustomer(this);
      if (isNullOrUndefined(customer.toObject().id)) {
        throw new Error('Conekta Customer not found');
      }
      if (plain) {
        return customer.toObject();
      } else {
        return customer;
      }
    } catch (err) {
      await this.createCustomer();
      return this.getCustomer(true);
    }
  }

  async sendEmailReserve(
    isFromWaiting: boolean,
    date: string,
    hour: string,
    studio: Studio,
    place: string,
    instructor: string,
    meeting_url: string = null
  ): Promise<any> {
    const subject = isFromWaiting ? '¡Tu espera terminó!' : 'Nueva Reserva';

    const info = await mailer.sendEmail({
      email: this.email,
      page: 'new_reserve',
      locale: 'es',
      context: {
        isFromWaiting,
        name: this.name,
        date,
        hour,
        studio: studio.name,
        isOnline: studio.slug === 'online',
        place,
        instructor,
        meeting_url,
      },
      subject,
    });

    log.debug('Sending new reserve email to:', this.email, info);

    return info;
  }

  async sendWaitingEmail(
    date: string,
    hour: string,
    studio: string,
    instructor: string,
  ): Promise<any> {
    const subject = 'Lista de espera';

    const info = await mailer.sendEmail({
      email: this.email,
      page: 'waiting_list',
      locale: 'es',
      context: {
        name: this.name,
        date,
        hour,
        studio,
        instructor,
      },
      subject,
    });

    return info;
  }

  async sendPurchaseEmail(
    plan: Plan,
  ): Promise<any> {
    const subject = 'Tu compra en We Active Tribe';

    const info = await mailer.sendEmail({
      email: this.email,
      page: 'purchase',
      locale: 'es',
      context: {
        name: this.name,
        plan: plan.name,
        credits: plan.credits,
        price: plan.price,
        expires_at: moment().add(plan.expires_numbers, plan.expires_unit).toDate()
      },
      subject,
    });


    return info;
  }

  async addCredits(charge: Charge): Promise<any> {
    if (charge.status === 'paid') {
      const plan = await Plan.findOne({ where: { name: charge.plan_name } });
      let CreditClass = plan.credit_type === 'classic' ? Credit : OnlineCredit;
      const date = moment()
        .add(plan.expires_numbers, plan.expires_unit)
        .toDate();

      const credits = Array(plan.credits).fill(date).map(async (date) => {
        const credit = new CreditClass({
          user_id: charge.user_id,
          expires_at: date,
          charge_id: charge.id
        });

        return await credit.save();
      });

      return await Promise.all(credits);
    }
  }

  async sendPurchaseFailureEmail(
    charge: Charge,
  ): Promise<any> {
    const subject = 'Tu pago ha sido declinado - We Active Tribe';

    const info = await mailer.sendEmail({
      email: this.email,
      page: 'purchase_failure',
      locale: 'es',
      context: {
        name: this.name,
        price: charge.paid,
      },
      subject,
    });


    return info;
  }

  async sendPushNotification(title: string, subtitle: string, content: string) {
    const notification = await axios.post<OneSignalResponse>(`${config.onesignal.api_url}`, {
      app_id: config.onesignal.app_id,
      filters: [{ field: "tag", key: "email", relation: "=", value: this.email }],
      headings: { en: title, es: title },
      subtitle: { en: subtitle, es: subtitle },
      contents: { en: content, es: content }
    }, {
      headers: {
        Authorization: `Basic ${config.onesignal.rest_api_key}`,
        ContentType: 'application/json; charset=utf-8'
      }
    });
    return notification;
  }

  async sendExpiresCredits(
    total_credits: number,
    plan_name: string,
    expire_date: Date,
  ): Promise<any> {
    const subject = 'Tus créditos están por vencer';

    const info = await mailer.sendEmail({
      email: this.email,
      page: 'expires_credits',
      locale: 'es',
      context: {
        plan_name,
        name: this.name,
        credits: total_credits,
        expire_date: moment(expire_date).format('DD/MM/YYYY'),
      },
      subject,
    });


    return info;
  }

  async sendMissYouEmail(): Promise<any> {
    const subject = `${this.name}, te extrañamos`;

    const info = await mailer.sendEmail({
      email: this.email,
      page: 'miss_you',
      locale: 'es',
      context: {
        name: this.name,
      },
      subject,
    });

    log.debug('Sending miss you email to:', this.email, info);

    return info;
  }
}
