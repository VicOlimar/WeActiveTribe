import { Model, Response } from "../Service/Service";
import axios from 'axios';
import { User } from "../Auth/Auth";
import BaseService from "../BaseService";

export interface Plan extends Model {
  name: string,
  credits: number,
  lessons: number,
  price: number,
  expires_numbers: number,
  expires_unit: 'days' | 'years' | 'months',
  credit_type: 'classic' | 'online',
  special: boolean,
  new_users_only: boolean,
}

export interface PlanPurcharseResponse extends Model {
  user: User,
  plan: Plan,
  card_id: string,
  discount: any,
}

class PlanService extends BaseService {

  protected url: string | undefined = process.env.REACT_APP_API_URL;

  async find(): Promise<Plan[] | null> {
    try {
      const response = await axios.get<Response<Plan>>(`${this.url}/plan?per_page=1000&active_desktop=true`);
      const { data: axiosData } = response;
      return axiosData.data as Plan[];
    } catch (error) {
      return null;
    }
  }

  async findOne(id: number): Promise<Plan> {
    const response = await axios.get<Response<Plan>>(`${this.url}/plan/${id}`);
    const { data: axiosData } = response;
    return axiosData.data as Plan;
  }

  async purchase(id: number, code: string, { cardId, tokenId }: { cardId?: string, tokenId?: string }): Promise<PlanPurcharseResponse | string> {
    try {
      const body: { card_id?: string, token_id?: string, code?: string } = {};
      if (cardId) {
        body.card_id = cardId;
      } else if (tokenId) {
        body.token_id = tokenId;
      }
      if (code) {
        body.code = code;
      }
      const response = await axios.post<Response<PlanPurcharseResponse>>(
        `${this.url}/plan/${id}/purchase`,
        body,
        this.getHeaders()
      );
      const { data: axiosData } = response;
      return axiosData.data as PlanPurcharseResponse;
    } catch (error) {
      if (error.response) {
        return error.response.data.message;
      } else {
        return 'Ocurrió un error al realizar la compra.';
      }

    }
  }

  async paypalPurchase(order_id: string, plan: Plan) {
    try {
      const response = await axios.post<Response<PlanPurcharseResponse>>(
        `${this.url}/plan/${plan.id}/paypal`,
        {
          order_id
        },
        this.getHeaders()
      );
      const { data: axiosData } = response;
      return axiosData.data as PlanPurcharseResponse;
    } catch (error) {
      if (error.response) {
        return error.response.data.message;
      } else {
        return 'Ocurrió un error al realizar la compra.';
      }

    }
  }
}

const service = new PlanService();
export default service;
