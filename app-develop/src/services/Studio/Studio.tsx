import { Model, Response } from "../Service/Service";
import Axios from 'react-native-axios';
import BaseService from "../BaseService";

export interface Studio extends Model {
  name: string;
  slug: string;
}

class StudioService extends BaseService {
  protected name = 'studio';

  async find(): Promise<Studio[] | null> {
    try {
      const response = await Axios.get<Response<Studio>>(`${this.url}/studio`);
      const { data: axiosData } = response;
      return axiosData.data as Studio[];
    } catch (error) {
      return null;
    }
  }

  async findOne(slug: string | string): Promise<Studio> {
    try {
      const response = await Axios.get<Response<Studio>>(`${this.url}/studio/${slug}`);
      const { data: axiosData } = response;
      return axiosData.data as Studio;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Ocurrió un error al obtener el estudio solicitado.');
      }
    }
  }

  async create(instance: Studio): Promise<Studio> {
    const response = await Axios.get<Response<Studio>>(`${this.url}/studio/`);
    return response.data.data as Studio;
  }
}

const service = new StudioService();
export default service;
