import * as conekta from 'conekta';
import axios from 'axios';
import { config } from '../config/config';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import { isNullOrUndefined } from 'util';
import { Plan } from '../models/Plan';
import { Charge } from '../models/Charge';
import { log } from './Log';
import { Discount } from '../models/Discount';
import { PaymentCustomer } from '../models/PaymentCustomer';

conekta.api_key = config.conekta.private_key;

const CENTS = 100;

export interface CustomerActionable {
  [x: string]: any;
  toObject(): Customer;
  update(customer: Customer): Promise<CustomerActionable>;
  delete(): Promise<CustomerActionable>;
  createPaymentSource(source: {
    type: string;
    token_id: string;
  }): PaymentSource;
  payment_sources?: PaymentSourcesActionable;
}

export interface Customer {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  default_payment_source_id?: string;
  payment_sources?: PaymentSources;
}

export interface PaymentSourcesActionable {
  get(index: number): any;
  nextPage(): PaymentSources;
  toObject(): PaymentSources;
}

export interface PaymentSources {
  has_more: boolean;
  data: PaymentSource[];
}

export interface PaymentSource {
  id: string;
  object: string;
  type: string;
  created_at: number;
  parent_id: string;
  last4: string;
  bin: string;
  exp_month: string;
  exp_year: string;
  brand: string;
  name: string;
  default: boolean;
  deleted?: boolean;
}

export interface OrderActionable {
  toObject(): Order;
}

export interface Order {
  livemode: boolean;
  amount: number;
  currency: string;
  payment_status?: string;
  amount_refunded: number;
  object: string;
  id: string;
  metadata: any;
  created_at: number;
  updated_at: number;
  customer_info: {
    email: string;
    name: string;
    corporate: boolean;
    customer_id: string;
    object: string;
  };
  line_items: {
    object: string;
    has_more: boolean;
    total: number;
    data: Array<{
      name: string;
      unit_price: number;
      quantity: number;
      object: string;
      id: string;
      parent_id: string;
      metadata: any;
      antifraud_info: any;
    }>;
  };
  charges: {
    object: string;
    has_more: boolean;
    total: number;
    data: Array<{
      id: string;
      livemode: boolean;
      created_at: number;
      currency: string;
      failure_code?: string;
      failure_message?: string;
      object: string;
      description: string;
      status: string;
      amount: number;
      fee: number;
      paid_at: number;
      customer_id: string;
      order_id: string;
      payment_method: {
        name: string;
        exp_month: string;
        exp_year: string;
        auth_code: string;
        object: string;
        type: string;
        last4: string;
        brand: string;
        issuer: string;
        account_type: string;
        country: string;
        fraud_indicators: Array<any>;
      };
    }>;
  };
}

export class Conekta {
  static API_KEY = config.conekta.private_key;
  static BASE = 'https://api.conekta.io';
  static AUTH = { username: Conekta.API_KEY, password: '' };

  static HEADERS = {
    Accept: 'application/vnd.conekta-v2.0.0+json',
    'Content-type': 'application/json',
  };

  static async createCustomer(user: User): Promise<string> {
    const body: Customer = { email: user.email };

    if (!isNullOrUndefined(user.name)) {
      body.name = user.name;
    }

    const response = await conekta.Customer.create(body);
    const customer = response.toObject();

    return customer.id as string;
  }

  static async findCustomer(user: User): Promise<CustomerActionable> {
    const paymentCustomer = await this.getPaymentCostumer(user);
    const response = (await conekta.Customer.find(
      paymentCustomer.payment_key,
    )) as CustomerActionable;
    return response;
  }

  static async updateCustomer(user: User): Promise<CustomerActionable> {
    const profile = (await user.$get('profile')) as Profile;
    const customer = (await user.getCustomer()) as CustomerActionable;

    const body: Customer = {
      email: user.email,
    };

    if (!isNullOrUndefined(user.name)) {
      body.name = user.name;
    }
    if (!isNullOrUndefined(profile.phone)) {
      body.name = profile.phone;
    }

    return customer.update(body);
  }

  static async deleteCustomer(user: User) {
    const customer = (await user.getCustomer()) as CustomerActionable;
    await customer.delete();
    return;
  }

  static async addCard(user: User, token_id: string, isDefault?: boolean): Promise<PaymentSource> {
    const customer = (await user.getCustomer()) as CustomerActionable;

    try {
      const source = await customer.createPaymentSource({
        type: 'card',
        token_id,
      });
      return source;
    } catch (err) {
      if (err.type === 'resource_not_found_error') {
        throw new Error('Card id not found');
      }
      throw err;
    }
  }

  static async getCards(user: User): Promise<PaymentSource[]> {
    const customer = (await user.getCustomer(true)) as Customer;

    const url = `${Conekta.BASE}/customers/${customer.id}/payment_sources/`;
    const sources = await axios.get<PaymentSources>(url, {
      headers: Conekta.HEADERS,
      auth: Conekta.AUTH,
    });

    return sources.data.data;
  }

  static async deleteCard(user: User, card_id: string): Promise<boolean> {
    const customer = (await user.getCustomer(true)) as Customer;

    const url = `${Conekta.BASE}/customers/${
      customer.id
      }/payment_sources/${card_id}`;

    const response = await axios.delete<PaymentSource>(url, {
      headers: Conekta.HEADERS,
      auth: Conekta.AUTH,
    });

    return response.data.deleted;
  }

  static async defaultCard(
    user: User,
    card_id: string,
  ): Promise<CustomerActionable> {
    const customer = (await user.getCustomer()) as CustomerActionable;

    const response = await customer.update({
      default_payment_source_id: card_id,
    });

    return response;
  }

  static async createCharge(
    user: User,
    plan: Plan,
    payment_source_id: string | null = null,
    discount: Discount = null,
    uniqueCharge: boolean = false,
  ): Promise<Charge> {
    const customer = (await user.getCustomer(true)) as Customer;

    let payment_method: { type: string; payment_source_id?: string, token_id?: string };
    if (!isNullOrUndefined(payment_source_id)) {
      payment_method = {
        type: 'card',
      };
      if (uniqueCharge) {
        payment_method.token_id = payment_source_id;
      } else {
        payment_method.payment_source_id = payment_source_id;
      }
    } else {
      payment_method = {
        type: 'default',
      };
    }

    let charge = new Charge();
    let conekta_charge: Order;
    try {
      const order = {
        line_items: [
          {
            name: `Plan ${plan.name} (${plan.credits} creditos)`,
            unit_price: plan.price * CENTS,
            quantity: 1,
          },
        ],
        currency: 'MXN',
        customer_info: { customer_id: customer.id },
        charges: [{ payment_method }],
      };

      if (!isNullOrUndefined(discount)) {
        let total = 0;
        if (discount.type === 'percentage') {
          total = plan.price * discount.discount;
        } else if (discount.type === 'amount') {
          total = discount.discount;
        }

        order['discount_lines'] = [{
          code: discount.code,
          type: 'coupon',
          amount: total,
        }];
      }
      const response: OrderActionable = await conekta.Order.create(order);
      conekta_charge = response.toObject();

      charge.processed_at = new Date(conekta_charge.charges.data[0].paid_at * 1000); // The created_at is a timestamp, so we need to convert it
    } catch (err) {
      try {
        // Save any error response
        log.debug(conekta_charge.line_items.data[0].antifraud_info);
        log.debug(
          conekta_charge.charges.data[0].payment_method.fraud_indicators,
        );
      } catch (err) { }

      if (err.type === 'processing_error') {
        conekta_charge = err.data;

        charge.error_code = conekta_charge.charges.data[0].failure_code;
        charge.processed_at = new Date(
          conekta_charge.charges.data[0].created_at * 1000, // The created_at is a timestamp, so we need to convert it
        );
      } else {
        throw err;
      }
    }
    console.log(conekta_charge.charges.data[0].payment_method);
    charge.order_id = conekta_charge.id;
    charge.paid = conekta_charge.amount / 100;
    charge.currency = conekta_charge.currency;
    charge.status = conekta_charge.charges.data[0].status;
    charge.customer_name = conekta_charge.charges.data[0].payment_method.name;
    charge.card_last4 = conekta_charge.charges.data[0].payment_method.last4;
    charge.card_type = conekta_charge.charges.data[0].payment_method.type;
    charge.card_brand = conekta_charge.charges.data[0].payment_method.brand;
    charge.auth_code = conekta_charge.charges.data[0].payment_method.auth_code;
    charge.issuer = conekta_charge.charges.data[0].payment_method.issuer;
    charge.fee = conekta_charge.charges.data[0].fee;
    charge.total_credits = plan.credits;

    if (discount !== null) {
      charge.discount_id = discount.id;
    }

    charge.user_id = user.id;
    charge.plan_name = plan.name;

    return await charge.save();
  }

  static async getCardId(user: User, card_id: string, token_id: string): Promise<string> {
    const customer = (await user.getCustomer(true)) as Customer;
    const payment_sources = customer.payment_sources.data;
    const payment_source = payment_sources.find(payment_source => {
      return payment_source.id === card_id;
    });
    return payment_source ? payment_source.id : token_id;
  }

  static async getPaymentCostumer(user: User): Promise<PaymentCustomer> {
    const profile = await user.$get('profile') as Profile;
    const paymentCustomer = await PaymentCustomer.findOne({
      where: { profile_id: profile.id, payment_gateway: 'conekta' }
    });
    if (!paymentCustomer) {
      throw new Error('Conekta payment customer not found');
    }

    return paymentCustomer;
  }
}
