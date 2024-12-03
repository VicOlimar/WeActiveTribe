import { Model, Response } from "../Service/Service";

import axios from 'axios';
import BaseService from "../BaseService";
import { Lesson } from "../Lesson/Lesson";
import { User } from "../Users/Users"; 

export interface Waiting extends Model {
  canceled: boolean,
  reserved_at: Date,
  date: Date,
  reserve_id: number,
  reserve: any,
  lesson_id: number,
  lesson: Lesson,
  user_id: number,
  user: User,
}

class WaitingService extends BaseService {

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
}
export default new WaitingService();
