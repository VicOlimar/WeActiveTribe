import {
  Table,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  Model,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  HasMany,
  AfterCreate,
  BeforeCreate,
  BeforeUpdate,
  AfterUpdate,
} from 'sequelize-typescript';
import { Plan } from './Plan';
import { User } from './User';
import { Credit } from './Credit';
import * as moment from 'moment';
import { Discount } from './Discount';
import { OnlineCredit } from './OnlineCredit';

@Table
export class Charge extends Model<Charge> {
  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  paid: number;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  total_credits: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  error_code: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  order_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  currency: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  customer_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  card_last4: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  card_type: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  card_brand: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  auth_code: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  issuer: string;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  fee: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  expires_at: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  processed_at: Date;

  @Column({
    type: DataType.ENUM('conekta', 'paypal', 'cash', 'credit-card'),
    allowNull: false,
    defaultValue: 'conekta',
  })
  payment_type: 'conekta' | 'paypal' | 'cash' | 'credit-card';

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  plan_name: string;

  @ForeignKey(() => Discount)
  @Column({
    allowNull: true
  })
  discount_id: number;

  @BelongsTo(() => Discount)
  discount: Discount;

  @ForeignKey(() => User)
  @Column
  user_id: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Credit, {
    as: 'credits'
  })
  credits: Credit[];

  @HasMany(() => OnlineCredit, {
    as: 'online_credits'
  })
  online_credits: OnlineCredit[];

  @HasMany(() => Credit, {
    scope: { used: true },
  })
  used_credits: Credit[];

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BeforeCreate
  static async set(charge: Charge, options: any) {
    if (options == 'courtesy') {
      charge.expires_at = moment()
        .add(30, 'd')
        .toDate();
      return charge;
    } else {
      const plan = await Plan.findOne({ where: { name: charge.plan_name } });
      charge.expires_at = moment()
        .add(plan.expires_numbers, plan.expires_unit)
        .toDate();
      return charge
    }
  }

  @AfterCreate
  static async createCredits(charge: Charge, options: any) {
    const plan = await Plan.findOne({
      where: {
        name: charge.plan_name,
      }
    });

    if (options == 'courtesy') {
      if (charge.status === 'paid') {
        let CreditClass = charge.plan_name.includes('online') ? OnlineCredit : Credit;
        const date = charge.expires_at;
        const credits = Array(+charge.total_credits).fill(date).map(async (date) => {
          const credit = new CreditClass({
            user_id: charge.user_id,
            expires_at: date,
            charge_id: charge.id,
            canceled: false,
            lesson_type_id: plan ? plan.lesson_type_id : null,
            studio_id: plan ? plan.studio_id : null,
          });

          return await credit.save();
        });

        await Promise.all(credits);
      }
    } else {
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
            charge_id: charge.id,
            canceled: false,
            lesson_type_id: plan ? plan.lesson_type_id : null,
            studio_id: plan ? plan.studio_id : null
          });

          return await credit.save();
        });

        await Promise.all(credits);
      }
    }

    return charge;
  }

  @BeforeUpdate
  static async verifyCancel(charge: Charge, options: any) {
    if (charge.status === 'canceled') {
      const credits = await charge.$count('used_credits');

      if (credits > 0) {
        throw new Error('No es posible cancelar un cargo con créditos utilizados.')
      }
    }

    return charge;
  }

  @AfterUpdate
  static async cancelCredits(charge: Charge, options: any) {
    if (charge.status === 'canceled') {
      const credits = await charge.$get('credits') as Credit[];

      await Promise.all(credits.map(async (credit) => {
        credit.canceled = true;
        return await credit.save();
      }));
    }

    return charge;
  }

}
