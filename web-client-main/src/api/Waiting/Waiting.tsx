import { Model, Response } from "../Service/Service";

import axios from 'axios';
import BaseService from "../BaseService";
import { Lesson } from "../Lesson/Lesson";
import { User } from "../Auth/Auth";
import { Reservation } from "../Reservation/ReservationService";

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

  async find(page: number = 1, pageSize: number = 10): Promise<{ data: Waiting[], count: number } | string> {
    let params: any = {
      per_page: pageSize,
      page: page,
    };

    try {
      const response = await axios.get<Response<Waiting>>(
        `${this.url}/waiting`,
        {
          ...this.getHeaders(),
          params: params
        },
      );
      const data = response.data.data as Waiting[];
      const count = response.headers['content-count'];
      return { data: data, count };
    } catch (error) {
      if (error.response) {
        return error.response.data.message;
      } else {
        return 'No pudimos recuperar tu lista de espera, por favor intenta de nuevo en unos momentos.';
      }
    }
  }

  async create(lesson_id: number | string): Promise<Waiting | undefined> {
    try {
      const response = await axios.post<Response<Waiting>>(
        `${this.url}/waiting`,
        {
          lesson_id: Number(lesson_id),
        },
        this.getHeaders()
      );
      const { data: axiosData } = response;
      return axiosData.data as Waiting;
    } catch (error) {
      return undefined;
    }
  }

  async delete(waiting: Waiting): Promise<Waiting | string> {
    try {
      const response = await axios.delete<Response<Waiting>>(
        `${this.url}/waiting/${waiting.id}`,
        this.getHeaders(),
      );
      const { data: axiosData } = response;
      return axiosData.data as Waiting;
    } catch (error) {
      if (error.response) {
        return error.response.data.message;
      } else {
        return 'Ocurrió un problema al cancelar la lista de espera, por favor intenta de nuevo más tarde.';
      }
    }
  }
}
export default new WaitingService();
