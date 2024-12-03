import { Model, Response } from "../Service/Service";
import { Studio } from "../Studio/Studio";

import axios from 'axios';
import { Instructor } from "../Instructor/Instructor";
import BaseService from "../BaseService";
import { Place } from "../Place/Place";
import { Reservation } from "../Reservation/ReservationService";

export interface Lesson extends Model {
  name: String,
  starts_at: Date,
  ends_at: Date,
  available: number,
  special?: boolean,
  instructors: Array<Instructor>,
  instructor_id: number,
  studio_id: number,
  studio: Studio,
  Reserve: Reservation,
  community: boolean,
  available_places: Place[];
  meeting_url: string;
  description?: string;
}

export interface LessonPlacesResponse extends Model {
  available: Place[],
  locked: Place[],
  visible: Place[],
}

export interface LessonType extends Model {
  name: string;
}

class LessonService extends BaseService {
  protected url: string | undefined = process.env.REACT_APP_API_URL;

  async find(studio: Studio, previewNextWeek: boolean = false): Promise<Lesson[] | null> {
    try {
      const response = await axios.get<Response<Lesson>>(
        `${this.url}/studio/${studio.slug}/lesson`,
        {
          params: previewNextWeek ? {
            preview: previewNextWeek,
          } : {}
        }
      );
      const { data: axiosData } = response;
      return axiosData.data as Lesson[];
    } catch (error) {
      return null;
    }
  }

  async findOne(studio: Studio, id: number): Promise<Lesson | undefined> {
    try {
      const response = await axios.get<Response<Lesson>>(`${this.url}/studio/${studio.slug}/lesson/${id}`);
      const { data: axiosData } = response;
      return axiosData.data as Lesson;
    } catch (error) {
      return undefined;
    }
  }

  async getAvailable(studio: Studio, id: number): Promise<LessonPlacesResponse | undefined> {
    try {
      const response = await axios.get<Response<LessonPlacesResponse>>(`${this.url}/studio/${studio.slug}/lesson/${id}/available`);
      const { data: axiosData } = response;
      return axiosData.data as LessonPlacesResponse;
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
          }
        }
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
