import Stripe from 'stripe';
import { config } from '../config/config';
import { User } from '../models/User';
import { Plan } from '../models/Plan';
import { Charge } from '../models/Charge';
import { Discount } from '../models/Discount';
import { Profile } from '../models/Profile';
import { PaymentCustomer } from '../models/PaymentCustomer';
import { PaymentSource } from './Conekta';

export class StripeService {
  private static stripe: Stripe;

  static initialize() {
    this.stripe = new Stripe(config.stripe.secret_key, {
      apiVersion: '2022-08-01',
    });
  }

  static async createCustomer(user: User): Promise<string> {
    const customer = await this.stripe.customers.create({
      email: user.email,
      name: user.name,
    });
    return customer.id;
  }

  static async findCustomer(user: User): Promise<Stripe.Customer | Stripe.DeletedCustomer> {
    const paymentCustomer = await this.getPaymentCostumer(user);
    return await this.stripe.customers.retrieve(paymentCustomer.payment_key);
  }

  static async updateCustomer(user: User): Promise<Stripe.Customer> {
    const customer = (await user.getCustomer(true)) as Stripe.Customer;
    return await this.stripe.customers.update(customer.id, {
      email: user.email,
      name: user.name,
    });
  }

  static async deleteCustomer(user: User) {
    const customer = (await user.getCustomer(true)) as Stripe.Customer;
    await this.stripe.customers.del(customer.id);
  }

  static async addCard(user: User, token_id: string, isDefault?: boolean): Promise<PaymentSource> {
    const customer = (await user.getCustomer(true)) as Stripe.Customer;
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: {
        token: token_id,
      },
    });
    await this.stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customer.id,
    });
    if (isDefault) {
      await this.stripe.customers.update(customer.id, {
        invoice_settings: {
          default_payment_method: paymentMethod.id,
        },
      });
    }

    return {
      id: paymentMethod.id,
      object: 'payment_source',
      type: paymentMethod.type,
      created_at: paymentMethod.created,
      parent_id: customer.id,
      last4: paymentMethod.card.last4,
      bin: paymentMethod.card.fingerprint,
      exp_month: paymentMethod.card.exp_month.toString(),
      exp_year: paymentMethod.card.exp_year.toString(),
      brand: paymentMethod.card.brand,
      name: paymentMethod.billing_details.name || '',
      default: false,
      deleted: false
    };
  }

  static async getCards(user: User): Promise<PaymentSource[]> {
    const customer = (await user.getCustomer(true)) as Stripe.Customer;
    const paymentMethods = await this.stripe.paymentMethods.list({
      customer: customer.id,
      type: 'card',
    });

    return paymentMethods.data.map(pm => ({
      id: pm.id,
      object: 'payment_source',
      type: pm.type,
      created_at: pm.created,
      parent_id: customer.id,
      last4: pm.card.last4,
      bin: pm.card.fingerprint, // Stripe doesn't provide BIN, using fingerprint as a unique identifier
      exp_month: pm.card.exp_month.toString(),
      exp_year: pm.card.exp_year.toString(),
      brand: pm.card.brand,
      name: pm.billing_details.name || '',
      default: pm.id === customer.invoice_settings?.default_payment_method,
      deleted: false
    }));
  }

  static async deleteCard(user: User, card_id: string): Promise<boolean> {
    await this.stripe.paymentMethods.detach(card_id);
    return true;
  }

  static async defaultCard(user: User, card_id: string): Promise<Stripe.Customer> {
    const customer = (await user.getCustomer(true)) as Stripe.Customer;
    return await this.stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: card_id,
      },
    });
  }

  static async createCharge(
    user: User,
    plan: Plan,
    payment_source_id: string | null = null,
    discount: Discount = null,
    uniqueCharge: boolean = false,
  ): Promise<Charge> {
    const customer = (await user.getCustomer(true)) as Stripe.Customer;
    let amount = plan.price * 100; // Stripe uses cents

    if (discount) {
      if (discount.type === 'percentage') {
        amount -= amount * discount.discount;
      } else if (discount.type === 'amount') {
        amount -= discount.discount * 100;
      }
    }

    // If payment_source_id is not provided, use the default payment method
    payment_source_id = payment_source_id || customer.invoice_settings?.default_payment_method as string;
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: 'mxn',
      customer: customer.id,
      payment_method: payment_source_id,
      off_session: !uniqueCharge,
      confirm: true,
    });

    const charge = new Charge();
    charge.order_id = paymentIntent.id;
    charge.paid = amount / 100;
    charge.currency = paymentIntent.currency;
    charge.status = paymentIntent.status === 'succeeded' ? 'paid' : 'failed';
    charge.customer_name = customer.name || user.getFullName();
    charge.card_last4 = paymentIntent.charges.data[0].payment_method_details.card.last4;
    charge.card_type = paymentIntent.charges.data[0].payment_method_details.card.brand;
    charge.card_brand = paymentIntent.charges.data[0].payment_method_details.card.brand;
    charge.auth_code = paymentIntent.charges.data[0].id;
    charge.issuer = paymentIntent.charges.data[0].payment_method_details.card.brand;
    charge.fee = paymentIntent.charges.data[0].application_fee_amount / 100;
    charge.total_credits = plan.credits;
    charge.user_id = user.id;
    charge.plan_name = plan.name;
    charge.processed_at = new Date(paymentIntent.created * 1000);
    charge.payment_method = 'stripe';

    if (discount) {
      charge.discount_id = discount.id;
    }

    return await charge.save();
  }

  static async getCardId(user: User, card_id: string, token_id: string): Promise<string> {
    return card_id;
  }

  static async getPaymentCostumer(user: User): Promise<PaymentCustomer> {
    const profile = await user.$get('profile') as Profile;
    const paymentCustomer = await PaymentCustomer.findOne({
      where: { profile_id: profile.id, payment_gateway: 'stripe' }
    });
    if (!paymentCustomer) {
      throw new Error('Stripe payment customer not found');
    }

    return paymentCustomer;
  }
}
