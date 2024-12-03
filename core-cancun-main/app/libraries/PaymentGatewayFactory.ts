import { Setting } from '../models/Setting';
import { Conekta } from './Conekta';
import { StripeService } from './Stripe';

export class PaymentGatewayFactory {
  static async getGateway() {
    const setting = await Setting.findOne({ where: { key: 'payment_gateway' } });
    if (setting && setting.value === 'stripe') {
      StripeService.initialize();
      return { PaymentGateway: StripeService, paymentGatewayName: setting.value };
    }

    return { PaymentGateway: Conekta, paymentGatewayName: 'conekta' };
  }
}
