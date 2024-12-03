import { Model, Response } from "../Service/Service";

import Axios from 'react-native-axios';
import BaseService from "../BaseService";
import { Lesson } from "../Lesson/Lesson";
import { User } from "../Auth/Auth";
import { Place } from "../Place/Place";

export interface Reservation extends Model {
  canceled: boolean,
  reserved_at: Date,
  place_id: number,
  place: Place,
  lesson_id: number,
  lesson: Lesson,
  credit_id: number,
  credit: any,
  user_id: number,
  user: User,
}

class ReservationService extends BaseService {

  async find(page: number = 1, pageSize: number = 10, showPast?: boolean): Promise<{ data: Reservation[], count: number }> {
    let params: any = {
      per_page: pageSize,
      page: page,
      past: showPast,
    };

    try {
      const headers = await this.getHeaders();
      const response = await Axios.get<Response<Reservation>>(
        `${this.url}/reserve`,
        {
          ...headers,
          params: params
        },
      );
      const data = response.data.data as Reservation[];
      const count = response.headers['content-count'];
      return { data: data, count };
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('No pudimos recuperar tu lista de reservas, por favor intenta de nuevo en unos momentos.');
      }
    }
  }

  async create(lesson_id: number | string, place_id: number | string): Promise<Reservation | string> {
    try {
      const headers = await this.getHeaders();
      const response = await Axios.post<Response<Reservation>>(
        `${this.url}/reserve`,
        {
          lesson_id,
          place_id,
        },
        headers
      );
      const { data: axiosData } = response;
      return axiosData.data as Reservation;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Ocurrió un error al realizar tu reserva, no se ha consumido ninguno de tus créditos.');
      }
    }
  }

  async delete(reservation: Reservation): Promise<Reservation> {
    try {
      const headers = await this.getHeaders();
      const response = await Axios.delete<Response<Reservation>>(
        `${this.url}/reserve/${reservation.id}`,
        headers,
      );
      const { data: axiosData } = response;
      return axiosData.data as Reservation;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Ocurrió un problema al obtener tu historial de compras.');
      }
    }
  }
}
const reservationService = new ReservationService();
export default reservationService;
