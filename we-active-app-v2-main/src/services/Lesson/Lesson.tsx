import {Model, Response} from '../Service/Service';
import {Studio} from '../Studio/Studio';

import Axios from 'axios';

import {Instructor} from '../Instructor/Instructor';
import BaseService from '../BaseService';
import {Reservation} from '../Reservation/Reservation';
import {AvailablePlacesResponse, AvailablePlaces} from './types';

export interface LessonType extends Model {
  name: string;
}

export interface Lesson extends Model {
  name: String;
  starts_at: Date;
  ends_at: Date;
  available: number;
  special?: boolean;
  instructors: Array<Instructor>;
  instructor_id: number;
  studio_id: number;
  studio: Studio;
  Reserve: Reservation;
  community: boolean;
  description?: string;
}

class LessonService extends BaseService {
  async find(
    studio: Studio,
    previewNextWeek: boolean = false,
  ): Promise<Lesson[] | null> {
    try {
      const response = await Axios.get<Response<Lesson>>(
        `${this.url}/studio/${studio.slug}/lesson`,
        {
          params: previewNextWeek
            ? {
                preview: previewNextWeek,
              }
            : {},
        },
      );
      const {data: axiosData} = response;
      return axiosData.data as Lesson[];
    } catch (error: any) {
      return null;
    }
  }

  async findOne(studio: Studio, id: number): Promise<Lesson | undefined> {
    try {
      const response = await Axios.get<Response<Lesson>>(
        `${this.url}/studio/${studio.slug}/lesson/${id}`,
      );
      const {data: axiosData} = response;
      return axiosData.data as Lesson;
    } catch (error: any) {
      return undefined;
    }
  }

  async getAvailable(
    studio: Studio,
    id: number,
  ): Promise<AvailablePlaces | undefined> {
    try {
      const response = await Axios.get<AvailablePlacesResponse>(
        `${this.url}/studio/${studio.slug}/lesson/${id}/available`,
      );
      const {data: axiosData} = response;
      return axiosData.data;
    } catch (error: any) {
      return undefined;
    }
  }

  async findNext(studio: Studio, date: Date): Promise<Lesson | undefined> {
    try {
      const response = await Axios.get<Response<Lesson>>(
        `${this.url}/studio/${studio.slug}/lesson/next`,
        {
          params: {
            starts_at: date,
          },
        },
      );
      const {data: axiosData} = response;
      return axiosData.data as Lesson;
    } catch (error: any) {
      return undefined;
    }
  }
}

const service = new LessonService();
export default service;
