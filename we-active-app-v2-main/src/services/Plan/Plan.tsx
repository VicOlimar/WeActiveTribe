import {Model, Response} from '../Service/Service';

import Axios from 'axios';
import BaseService from '../BaseService';
import {User} from '../Auth/Auth';

export interface Plan extends Model {
  name: String;
  price: number;
  credits: number;
  expires_numbers: string;
  expires_unit: 'years' | 'months' | 'days';
  special: boolean;
  active: boolean;
  new_users_only: boolean;
}

export interface PlanPurcharseResponse extends Model {
  user: User;
  plan: Plan;
  card_id: string;
  discount: any;
}

class PlanService extends BaseService {
  async find(): Promise<Plan[]> {
    try {
      const response = await Axios.get<Response<Plan>>(`${this.url}/plan`);
      const {data: axiosData} = response;
      return axiosData.data as Plan[];
    } catch (error: any) {
      throw new Error('Ocurrió un problema al recuperar los planes');
    }
  }

  async purchase(
    id: number,
    card_id: string,
    chargeUnique: boolean = false,
    code: string,
  ): Promise<PlanPurcharseResponse | string> {
    const headers = await this.getHeaders();
    try {
      const body: {card_id?: string; token_id?: string; code?: string} = {};
      if (chargeUnique) {
        body.token_id = card_id;
      } else {
        body.card_id = card_id;
      }
      if (code) {
        body.code = code;
      }
      const response = await Axios.post<Response<PlanPurcharseResponse>>(
        `${this.url}/plan/${id}/purchase`,
        body,
        headers,
      );
      const {data: axiosData} = response;
      return axiosData.data as PlanPurcharseResponse;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(
          'Ocurrió un error con tu tarjeta, no se hizo ningún cargo, por favor intenta de nuevo o intenta con otra tarjeta.',
        );
      }
    }
  }
}

export default new PlanService();
