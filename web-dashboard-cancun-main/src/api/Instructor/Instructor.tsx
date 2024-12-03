import { Model, Response } from "../Service/Service";

import axios from "axios";
import BaseService from "../BaseService";
import { Lesson } from "../Lesson/Lesson";

export interface Instructor extends Model {
  name: string;
  description: string;
  email: string;
  avatar: any;
  lessons?: Lesson[];
}

export interface getIsntructorsResponse {
  instructors: Instructor[];
  count: number;
}

class InstructorService extends BaseService {
  async find(
    per_page: number,
    page: number
  ): Promise<getIsntructorsResponse | undefined> {
    try {
      const response = await axios.get<Response<Instructor>>(
        `${this.url}/instructor`,
        { params: { per_page: per_page, page: page } }
      );
      const { data: axiosData, headers: axiosHeaders } = response;
      const dataResponse: getIsntructorsResponse = {
        instructors: axiosData.data as Instructor[],
        count: axiosHeaders["content-count"]
      };
      return dataResponse;
    } catch (error) {
      return undefined;
    }
  }

  async findOne(id: number): Promise<Instructor | undefined> {
    try {
      const response = await axios.get<Response<Instructor>>(
        `${this.url}/instructor/${id}/true`
      );
      const { data: axiosData } = response;
      return axiosData.data as Instructor;
    } catch (error) {
      return undefined;
    }
  }

  async create(
    name: string,
    description: string,
    email: string
  ): Promise<Instructor | undefined> {
    try {
      const response = await axios.post<Response<Instructor>>(
        `${this.url}/instructor/`,
        { name, description, email },
        this.getHeaders()
      );
      const { data: axiosData } = response;
      return axiosData.data as Instructor;
    } catch (error) {
      return undefined;
    }
  }

  async Remove(id: number): Promise<number | string> {
    try {
      const response = await axios.delete<Response<Instructor>>(
        `${this.url}/instructor/${id}`,
        this.getHeaders()
      );
      const { status } = response;
      return status;
    } catch (error) {
      return error.response.data.message;
    }
  }

  async update(
    id: number,
    name: string,
    description: string,
    email: string,
    experience: string
  ): Promise<Instructor | undefined> {
    try {
      const response = await axios.post<Response<Instructor>>(
        `${this.url}/instructor/${id}`,
        { name, description, email, experience },
        this.getHeaders()
      );
      const { data: axiosData } = response;
      return axiosData.data as Instructor;
    } catch (error) {
      return undefined;
    }
  }

  async uploadAvatar(id: number, avatar: any): Promise<string | undefined> {
    try {
      const formData = new FormData();
      formData.append('avatar', avatar);

      const response = await axios.post<Response<any>>(
        `${this.url}/instructor/${id}/avatar`,
        formData,
        this.getHeadersMultipart()
      );
      const { data: axiosData } = response;
      return axiosData.data.url;
    } catch (error) {
      return undefined;
    }
  }

}
export default new InstructorService();
