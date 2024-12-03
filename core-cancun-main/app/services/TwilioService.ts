
import * as twilio from 'twilio';
import * as TwilioClient from 'twilio/lib/rest/Twilio';
import { config } from '../config/config';

const authToken = 'your_auth_token';


class TwilioService {
  client: TwilioClient;

  constructor() {
    this.client = twilio(config.twilio.sid, config.twilio.token);
  }

  async sendTo(number: string, message: string) {
    try {
      await this.client.messages.create({
        body: message,
        from: config.twilio.phone,
        to: `+521${number}`
      });
    } catch(err) {
      throw new Error(`No fue posible comunicarnos con el número: ${number}`)
    }
  }
}

const twilioService = new TwilioService();
export default twilioService;