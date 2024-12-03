import { Model, Response } from "../Service/Service";

import axios from 'axios';
import BaseService from "../BaseService";
import { Lesson } from "../Lesson/Lesson";
import { User } from "../Auth/Auth";

export interface Reservation extends Model {
  canceled: boolean,
  reserved_at: Date,
  place_id: number,
  place: any,
  lesson_id: number,
  lesson: Lesson,
  credit_id: number,
  credit: any,
  user_id: number,
  user: User,
}

class ReservationService extends BaseService {

  async find(page: number = 1, pageSize: number = 10, showPast?: boolean): Promise<{ data: Reservation[], count: number } | undefined> {
    let params: any = {
      per_page: pageSize,
      page: page,
      past: showPast,
    };

    try {
      const response = await axios.get<Response<Reservation>>(
        `${this.url}/reserve`,
        {
          ...this.getHeaders(),
          params: params
        },
      );
      const data = response.data.data as Reservation[];
      const count = response.headers['content-count'];
      return { data: data, count };
    } catch (error) {
      return undefined;
    }
  }

  async create(lesson_id: number | string, place_id: number | string): Promise<Reservation | string> {
    try {
      const response = await axios.post<Response<Reservation>>(
        `${this.url}/reserve`,
        {
          lesson_id,
          place_id,
        },
        this.getHeaders()
      );
      const { data: axiosData } = response;
      return axiosData.data as Reservation;
    } catch (error) {
      if (error.response) {
        return error.response.data.message;
      } else {
        return 'Ocurrió un problema al realizar tu reservación, intenta de nuevo, no hemos descontado ningún crédito a tu cuenta.';
      }
    }
  }

  async delete(reservation: Reservation): Promise<Reservation | string> {
    try {
      const response = await axios.delete<Response<Reservation>>(
        `${this.url}/reserve/${reservation.id}`,
        this.getHeaders(),
      );
      const { data: axiosData } = response;
      return axiosData.data as Reservation;
    } catch (error) {
      if (error.response) {
        return error.response.data.message;
      } else {
        return 'Ocurrió un problema al obtener tu historial de compras.';
      }
    }
  }
}
export default new ReservationService();
