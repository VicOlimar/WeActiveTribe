import axios from 'axios';
import { Model, Response } from '../Service/Service';
import BaseService from '../BaseService';

export const DEFAULT_LESSON_TYPE = 'Normales';
export interface LessonType extends Model {
  name: string;
}

interface LessonTypeResponse {
  data: LessonType[];
}

interface LessonTypePaginateResponse extends LessonTypeResponse {
  count: number;
}

export class LessonTypeService extends BaseService {

  async paginate(page: number = 1, pageSize: number = 10): Promise<LessonTypePaginateResponse> {
    try {
      const response = await axios.get<LessonTypePaginateResponse>(
        `${this.url}/lesson_type`,
        {
          ...this.getHeaders(),
          params: {
            per_page: pageSize,
            page: page,
          }
        }
      );
      const data = response.data.data as LessonType[];
      const count = response.headers['content-count'];
      return { data, count };
    } catch (error) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message)
      } else {
        throw new Error('Error creando el tipo de clase.');
      }
    }
  }

  async list() {
    try {
      const response = await axios.get<LessonTypeResponse>(
        `${this.url}/lesson_type`,
        this.getHeaders()
      );
      const { data: axiosData } = response;
      return axiosData.data;
    } catch (error) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message)
      } else {
        throw new Error('Error creando el tipo de clase.');
      }
    }
  }

  async create(lessonType: LessonType) {
    try {
      const response = await axios.post<Response<LessonType>>(
        `${this.url}/lesson_type`,
        lessonType,
        this.getHeaders()
      );
      const { data: axiosData } = response;
      return axiosData.data;
    } catch (error) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message)
      } else {
        throw new Error('Error creando el tipo de clase.');
      }
    }
  }

  async update(lessonType: LessonType) {
    try {
      const response = await axios.post<Response<LessonType>>(
        `${this.url}/lesson_type/${lessonType.id}`,
        lessonType,
        this.getHeaders()
      );
      const { data: axiosData } = response;
      return axiosData.data;
    } catch (error) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message)
      } else {
        throw new Error('Error creando el tipo de clase.');
      }
    }
  }

  async remove(lessonType: LessonType): Promise<boolean> {
    try {
      await axios.delete<Response<LessonType>>(
        `${this.url}/lesson_type/${lessonType.id}`,
        this.getHeaders()
      );
      return true;
    } catch (error) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message)
      } else {
        throw new Error('Error creando el tipo de clase.');
      }
    }
  }

}

const service = new LessonTypeService();
export default service;