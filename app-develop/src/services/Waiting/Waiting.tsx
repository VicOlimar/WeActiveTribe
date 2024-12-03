import { Model, Response } from "../Service/Service";

import axios from 'axios';
import BaseService from "../BaseService";
import { Lesson } from "../Lesson/Lesson";
import { User } from "../Auth/Auth";
import { Reservation } from "../Reservation/Reservation";

export interface Waiting extends Model {
  canceled: boolean,
  reserved_at: Date,
  date: Date,
  reserve_id: number,
  reserve: Reservation,
  lesson_id: number,
  lesson: Lesson,
  user_id: number,
  user: User,
}

class WaitingService extends BaseService {

  async find(page: number = 1, pageSize: number = 10): Promise<{ data: Waiting[], count: number }> {
    let params: any = {
      per_page: pageSize,
      page: page,
    };

    try {
      const headers = await this.getHeaders();
      const response = await axios.get<Response<Waiting>>(
        `${this.url}/waiting`,
        {
          ...headers,
          params: params
        },
      );
      const data = response.data.data as Waiting[];
      const count = response.headers['content-count'];
      return { data: data, count };
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('No pudimos recuperar tu lista de espera, por favor intenta de nuevo en unos momentos.');
      }
    }
  }

  async create(lesson_id: number | string): Promise<Waiting | undefined> {
    try {
      const headers = await this.getHeaders();
      const response = await axios.post<Response<Waiting>>(
        `${this.url}/waiting`,
        {
          lesson_id: Number(lesson_id),
        },
        headers
      );
      const { data: axiosData } = response;
      return axiosData.data as Waiting;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Ocurrió un error al anotarte a la lista de espera, intenta de nuevo.');
      }
    }
  }

  async delete(waiting: Waiting): Promise<Waiting | string> {
    try {
      const headers = await this.getHeaders();
      const response = await axios.delete<Response<Waiting>>(
        `${this.url}/waiting/${waiting.id}`,
        headers,
      );
      const { data: axiosData } = response;
      return axiosData.data as Waiting;
    } catch (error) {
      if (error.response) {
        return error.response.data.message;
      } else {
        return 'Ocurrió un problema al cancelar tu solicitud de lista de espera, por favor intenta de nuevo más tarde.';
      }
    }
  }
}
export default new WaitingService();
