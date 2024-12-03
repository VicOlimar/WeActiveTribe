import { Model, Response } from "../Service/Service";

import axios, { AxiosError } from "axios";
import BaseService from "../BaseService";
import { Lesson } from "../Lesson/Lesson";
import { User } from "../Users/Users";

export interface Reservation extends Model {
  canceled: boolean;
  reserved_at: Date;
  place_id: number;
  place: any;
  lesson_id: number;
  lesson: Lesson;
  credit_id: number;
  credit: any;
  user_id: number;
  user: User;
}

class ReservationService extends BaseService {
  async create(
    lesson_id: number | string,
    place_id: number | string,
    user_id: number | null = null
  ): Promise<Reservation | string> {
    try {
      let body: any = {};
      body.lesson_id = lesson_id;
      body.place_id = place_id;

      if (user_id !== null) {
        body.user_id = user_id;
      }

      const response = await axios.post<Response<Reservation>>(
        `${this.url}/reserve`,
        body,
        this.getHeaders()
      );
      const { data: axiosData } = response;
      return axiosData.data as Reservation;
    } catch (error) {
      if ((error as AxiosError).response) {
        return (error as AxiosError).response?.data.message;
      } else {
        return "Ocurrió un problema al crear la reserva.";
      }
    }
  }

  async delete(reservation: Reservation): Promise<Reservation | undefined> {
    try {
      const response = await axios.delete<Response<Reservation>>(
        `${this.url}/reserve/${reservation.id}`,
        this.getHeaders()
      );
      const { data: axiosData } = response;
      return axiosData.data as Reservation;
    } catch (error) {
      return undefined;
    }
  }
}

const reservationService = new ReservationService();
export default reservationService;
