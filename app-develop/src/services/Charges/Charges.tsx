import { Model, Response } from "../Service/Service";

import Axios from 'react-native-axios';
import BaseService from "../BaseService";

export interface Charge extends Model {
  expires_at: Date,
  canceled: boolean,
  used: boolean,
  payment_type: string,
}

class ChargeService extends BaseService {

  async find(): Promise<Charge[]> {
    const headers = await this.getHeaders();
    try {
      const response = await Axios.get<Response<Charge>>(
        `${this.url}/charges`,
        headers
      );
      const { data: axiosData } = response;
      return axiosData.data as Charge[];
    } catch (error) {
      throw new Error('Error al recuperar tu historial de compra.');
    }
  }
}
export default new ChargeService();
