import {Model, Response} from '../Service/Service';

import Axios from 'axios';
import BaseService from '../BaseService';

export interface Card extends Model {
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

class CardService extends BaseService {
  async find(): Promise<Card[]> {
    const headers = await this.getHeaders();
    try {
      const response = await Axios.get<Response<Card>>(
        `${this.url}/card`,
        headers,
      );
      const {data: axiosData} = response;
      return axiosData.data as Card[];
    } catch (error: any) {
      throw new Error('Error al recuperar tus métodos de pago.');
    }
  }

  async create(token_id: string): Promise<Card> {
    const headers = await this.getHeaders();
    try {
      const response = await Axios.post<Response<Card>>(
        `${this.url}/card`,
        {
          token_id,
        },
        headers,
      );
      const {data: axiosData} = response;
      return axiosData.data as Card;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Error al agregar el método de pago');
      }
    }
  }

  async update(card_id: string | number): Promise<Card> {
    const headers = await this.getHeaders();

    try {
      const response = await Axios.put<Response<Card>>(
        `${this.url}/card/default`,
        {
          card_id,
        },
        headers,
      );
      const {data: axiosData} = response;
      return axiosData.data as Card;
    } catch (error: any) {
      throw new Error('Error al actualizar el método de pago');
    }
  }

  async delete(card_id: string | number): Promise<Card | boolean> {
    const headers = await this.getHeaders();

    try {
      const response = await Axios.delete<Response<Card>>(`${this.url}/card`, {
        ...headers,
        data: {
          card_id,
        },
      });
      return response.status === 204;
    } catch (error: any) {
      throw new Error('Error al eliminar el método de pago.');
    }
  }
}
export default new CardService();
