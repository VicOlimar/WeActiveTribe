import { Model, Response } from "../Service/Service";

import axios from 'axios';
import BaseService from "../BaseService";

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

class CardsService extends BaseService {

  async find(): Promise<Card[] | undefined> {
    try {
      const response = await axios.get<Response<Card>>(
        `${this.url}/card`,
        this.getHeaders()
      );
      const { data: axiosData } = response;
      return axiosData.data as Card[];
    } catch (error) {
      return undefined;
    }
  }

  async create(token_id: string): Promise<Card | undefined> {
    try {
      const response = await axios.post<Response<Card>>(
        `${this.url}/card`,
        {
          token_id,
        },
        this.getHeaders()
      );
      const { data: axiosData } = response;
      return axiosData.data as Card;
    } catch (error) {
      return undefined;
    }
  }

  async update(card_id: string | number): Promise<Card | undefined> {
    try {
      const response = await axios.put<Response<Card>>(
        `${this.url}/card/default`,
        {
          card_id,
        },
        this.getHeaders()
      );
      const { data: axiosData } = response;
      return axiosData.data as Card;
    } catch (error) {
      return undefined;
    }
  }

  async delete(card_id: string | number): Promise<Card | boolean> {
    try {
      const response = await axios.delete<Response<Card>>(
        `${this.url}/card`,
        {
          ...this.getHeaders(),
          data: {
            card_id,
          }
        }
      );
      return response.status === 204;
    } catch (error) {
      return false;
    }
  }
}
export default new CardsService();
