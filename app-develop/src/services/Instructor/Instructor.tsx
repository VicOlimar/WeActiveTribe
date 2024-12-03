import { Model, Response } from "../Service/Service";

import Axios from 'react-native-axios';
import BaseService from "../BaseService";
import AsyncStorage from "@react-native-community/async-storage";

export interface Instructor extends Model {
  name: string,
  description: string,
  avatar: any,
}

class InstructorService extends BaseService {

  async find(): Promise<Instructor[] | undefined> {
    try {
      const response = await Axios.get<Response<Instructor>>(
        `${this.url}/instructor?per_page=1000`
      );
      const { data: axiosData } = response;
      return axiosData.data as Instructor[];
    } catch (error) {
      return undefined;
    }
  }

  async findOne(id: number): Promise<Instructor | undefined> {
    try {
      const response = await Axios.get<Response<Instructor>>(
        `${this.url}/instructor/${id}`
      );
      const { data: axiosData } = response;
      return axiosData.data as Instructor;
    } catch (error) {
      return undefined;
    }
  }
}
export default new InstructorService();
