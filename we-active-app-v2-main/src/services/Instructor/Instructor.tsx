import {Model, Response} from '../Service/Service';

import Axios from 'axios';
import BaseService from '../BaseService';

export interface Instructor extends Model {
  name: string;
  description: string;
  avatar: any;
}

class InstructorService extends BaseService {
  async find(): Promise<Instructor[] | undefined> {
    try {
      const response = await Axios.get<Response<Instructor>>(
        `${this.url}/instructor?per_page=1000`,
      );
      const {data: axiosData} = response;
      return axiosData.data as Instructor[];
    } catch (error: any) {
      return undefined;
    }
  }

  async findOne(id: number): Promise<Instructor | undefined> {
    try {
      const response = await Axios.get<Response<Instructor>>(
        `${this.url}/instructor/${id}`,
      );
      const {data: axiosData} = response;
      return axiosData.data as Instructor;
    } catch (error: any) {
      return undefined;
    }
  }
}
export default new InstructorService();
