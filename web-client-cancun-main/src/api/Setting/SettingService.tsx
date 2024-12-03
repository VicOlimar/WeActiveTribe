import axios from 'axios';
import BaseService from "../BaseService";
import { Model, Response } from "../Service/Service";

export interface Setting extends Model {
  key: string;
  value: string;
}

class SettingService extends BaseService {
  async getPaymentGateway(): Promise<string> {
    try {
      const response = await axios.get<Response<Setting>>(
        `${this.url}/setting/payment_gateway`
      );
      if (response.data.status < 400 && response.data.data) {
        if (Array.isArray(response.data.data)) {
            return response.data.data[0].value;
        } else {
            return response.data.data.value;
        }
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching payment gateway setting:', error);
      return 'stripe';
    }
  }
}

export default new SettingService();