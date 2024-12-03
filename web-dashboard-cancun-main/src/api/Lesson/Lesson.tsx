import { Model, Response } from '../Service/Service';
import { Studio } from '../Studio/Studio';
import axios from 'axios';
import { Instructor } from '../Instructor/Instructor';
import BaseService from '../BaseService';
import { Place } from '../Place/Place';
import { Reservation } from '../Reservation/ReservationService';
import { User } from '../Users/Users';

export interface Lesson extends Model {
  name: string;
  starts_at: Date;
  ends_at: Date;
  available: number;
  special?: boolean;
  instructor: Instructor;
  instructors: Instructor[];
  studio_id: number;
  studio: Studio;
  Reserve: Reservation;
  community: boolean;
  meeting_url: string;
  description?: string;
  reserved_places: Place[];
}

class LessonService extends BaseService {
  protected url: string | undefined = process.env.REACT_APP_API_URL;

  async create(
    slug: string,
    name: string,
    instructors: number[],
    special: boolean,
    starts_at: Date,
    duration: number,
    unit: string,
    community: boolean,
    meeting_url: string | null,
    lesson_type_id: number | undefined,
    description: string | undefined,
  ): Promise<any> {
    try {
      const response = await axios.post<Response<Lesson>>(
        `${this.url}/studio/${slug}/lesson/`,
        {
          name,
          instructors,
          special,
          starts_at,
          duration,
          unit,
          community,
          meeting_url,
          lesson_type_id,
          description,
        },
        this.getHeaders(),
      );
      const { data: axiosData } = response;
      return axiosData.data;
    } catch (error) {
      if (error.response.data.message === 'hours_overlap')
        return 'hours_overlap';
      else if (typeof error.response.data.data[0] === 'string')
        return error.response.data.data[0];
      else return 'Error desconocido creando la clase';
    }
  }

  async update(
    slug: string,
    lesson_id: number,
    name: string,
    instructors: number[],
    special: boolean,
    starts_at: Date,
    duration: any,
    unit: any,
    community: boolean,
    meeting_url: string | null,
    lesson_type_id: number | undefined,
    description: string | undefined,
  ): Promise<any> {
    try {
      const response = await axios.post<Response<Lesson>>(
        `${this.url}/studio/${slug}/lesson/${lesson_id}`,
        {
          slug,
          name,
          instructors,
          special,
          starts_at,
          community,
          duration,
          unit,
          meeting_url,
          lesson_type_id: lesson_type_id || null,
          description,
        },
        this.getHeaders(),
      );
      const { data: axiosData } = response;
      return axiosData.data;
    } catch (error) {
      if (error.response.data.message) return error.response.data.message;
      else return 'Error desconocido actualizando la clase';
    }
  }

  async find(studio: Studio, starts: any, ends: any): Promise<Lesson[] | null> {
    try {
      const response = await axios.get<Response<Lesson>>(
        `${this.url}/studio/${studio.slug}/lesson`,
        {
          ...this.getHeaders(),
          params: {
            starts_at: starts,
            ends_at: ends,
          },
        },
      );
      const { data: axiosData } = response;
      return axiosData.data as Lesson[];
    } catch (error) {
      return null;
    }
  }

  async filterByDate(starts: any, ends: any): Promise<Lesson[] | null> {
    try {
      const response = await axios.get<Response<Lesson>>(`${this.url}/lesson`, {
        ...this.getHeaders(),
        params: {
          starts_at: starts,
          ends_at: ends,
        },
      });
      const { data: axiosData } = response;
      return axiosData.data as Lesson[];
    } catch (error) {
      return null;
    }
  }

  async findOne(studio: Studio, id: number): Promise<Lesson | undefined> {
    try {
      const response = await axios.get<Response<Lesson>>(
        `${this.url}/studio/${studio.slug}/lesson/${id}`,
        this.getHeaders(),
      );
      const { data: axiosData } = response;
      return axiosData.data as Lesson;
    } catch (error) {
      return undefined;
    }
  }

  async cancel(studio: Studio, id: number): Promise<any> {
    try {
      const response = await axios.delete<Response<any>>(
        `${this.url}/studio/${studio.slug}/lesson/${id}`,
        this.getHeaders(),
      );
      const { status } = response;
      return status;
    } catch (error) {
      if (error.response.data.data[0]) return error.response.data.data[0];
      else return 'Error desconocido creando la clase';
    }
  }

  async getAssistants(slug: string, id: number): Promise<any | undefined> {
    try {
      const response = await axios.get<Response<any>>(
        `${this.url}/studio/${slug}/lesson/${id}/assistants/`,
        this.getHeaders(),
      );
      const { data: axiosData } = response;
      return axiosData.data as User[];
    } catch (error) {
      return undefined;
    }
  }

  async getWaitingAssistants(
    slug: string,
    id: number,
  ): Promise<any | undefined> {
    try {
      const response = await axios.get<Response<any>>(
        `${this.url}/studio/${slug}/lesson/${id}/waiting/`,
        this.getHeaders(),
      );
      const { data: axiosData } = response;
      return axiosData.data as User[];
    } catch (error) {
      return undefined;
    }
  }

  async getCanceledAssistants(
    slug: string,
    id: number,
  ): Promise<any | undefined> {
    try {
      const response = await axios.get<Response<any>>(
        `${this.url}/studio/${slug}/lesson/${id}/assistants/?canceled=true`,
        this.getHeaders(),
      );
      const { data: axiosData } = response;
      return axiosData.data as User[];
    } catch (error) {
      return undefined;
    }
  }

  async getAvailable(studio: Studio, id: number): Promise<any | undefined> {
    try {
      const response = await axios.get<Response<Place>>(
        `${this.url}/studio/${studio.slug}/lesson/${id}/available`,
      );
      const { data: axiosData } = response;
      return axiosData.data as any;
    } catch (error) {
      return undefined;
    }
  }

  async findNext(studio: Studio, date: Date): Promise<Lesson | undefined> {
    try {
      const response = await axios.get<Response<Lesson>>(
        `${this.url}/studio/${studio.slug}/lesson/next`,
        {
          params: {
            starts_at: date,
          },
        },
      );
      const { data: axiosData } = response;
      return axiosData.data as Lesson;
    } catch (error) {
      return undefined;
    }
  }
}

const service = new LessonService();
export default service;
