import axios from 'axios';
import { Model, Response } from '../Service/Service';
import BaseService from '../BaseService';
import { Reservation } from '../Reservation/ReservationService';
import { Purchase } from '../Purchases/Purchases';
import { Plan } from '../Plan/Plan';
import { AuthResponse } from '../Auth/Auth';
import moment from 'moment';

export interface BaseResponse {
  status: number;
  message: string;
}

export interface UserWithReserve extends User {
  Reserve: Reservation;
}

export interface User extends Model {
  email: string;
  name: string;
  last_name: string;
  profile: Profile;
  role: string;
  charges: Purchase[];
  plan: Plan;
  active: boolean;
  created_at: Date | undefined;
  available_credits: any[];
  available_online_credits: any[];
}

export interface Profile extends Model {
  locale: string;
  payment_key?: string;
  phone?: string;
  birthdate: Date;
  emergency_contact: string;
  time_zone: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

type FilterOptions = {
  per_page?: number;
  page?: number;
  search?: string;
  start_date?: Date;
  end_date?: Date;
};

export interface MeResponse extends BaseResponse {
  data: {
    credits: {
      to_expire: number;
      available: number;
    };
  };
}

export interface Me {
  credits: {
    to_expire: number;
    available: number;
  };
}

export interface UserProfile extends Model {
  user: User;
  profile: Profile;
}

export class AuthService extends BaseService {
  protected url: string | undefined = process.env.REACT_APP_API_URL;

  async findOne(id: number): Promise<User | undefined> {
    try {
      const response = await axios.get<Response<User>>(
        `${this.url}/user/${id}`,
        {
          ...this.getHeaders(),
        },
      );
      const data = response.data.data as User;
      return data;
    } catch (error) {
      return undefined;
    }
  }

  async login(email: string, password: string): Promise<any | null> {
    try {
      const response = await axios.post<AuthResponse>(
        `${this.url}/auth/login`,
        {
          email,
          password,
        },
      );
      const { data: axiosData } = response;
      return axiosData.data as any;
    } catch (error) {
      return null;
    }
  }

  async register(email: string, password: string, name: string | null = null) {
    try {
      const response = await axios.post<AuthResponse>(
        `${this.url}/auth/register`,
        {
          email,
          password,
          name,
        },
      );
      const { data: axiosData } = response;
      return axiosData.data as any;
    } catch (error) {
      return null;
    }
  }

  async me(): Promise<Me | undefined> {
    try {
      const response = await axios.get<MeResponse>(
        `${this.url}/user/me`,
        this.getHeaders(),
      );
      const { data: axiosData } = response;
      return axiosData.data as Me;
    } catch (error) {
      return undefined;
    }
  }

  async updateProfile(profile: any): Promise<UserProfile | undefined> {
    try {
      const response = await axios.post<Response<UserProfile>>(
        `${this.url}/user/me`,
        {
          user: {
            name: profile.name,
            email: profile.email,
            birthdate: profile.birthdate,
            emergency_contact: profile.emergency_contact,
          },
          profile: {
            time_zone: profile.time_zone,
            phone: profile.phone,
            locale: profile.locale,
          },
        },
        this.getHeaders(),
      );
      const { data: axiosData } = response;
      return axiosData.data as UserProfile;
    } catch (error) {
      return undefined;
    }
  }

  async find(
    page: number = 1,
    pageSize: number = 10,
    substring: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{ data: User[]; count: number } | undefined> {
    try {
      const params: FilterOptions = {
        per_page: pageSize,
        page: page,
        search: substring,
      };

      if (startDate && endDate) {
        params.start_date = moment(startDate).utc().toDate();
        params.end_date = moment(endDate).utc().toDate();
      }

      const response = await axios.get<Response<User>>(`${this.url}/user`, {
        ...this.getHeaders(),
        params,
      });
      const data = response.data.data as User[];
      const count = response.headers['content-count'];
      return { data, count };
    } catch (error) {
      return undefined;
    }
  }

  async lessons(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ data: Reservation[]; count: number } | undefined> {
    try {
      const response = await axios.get<Response<Reservation>>(
        `${this.url}/user/me/lessons`,
        {
          ...this.getHeaders(),
          params: {
            per_page: pageSize,
            page: page,
          },
        },
      );
      const data = response.data.data as Reservation[];
      const count = response.headers['content-count'];
      return { data: data, count };
    } catch (error) {
      return undefined;
    }
  }

  async activate(id: number, active: boolean) {
    try {
      const response = await axios.post<Response<User>>(
        `${this.url}/user/${id}/status`,
        {
          active,
        },
        {
          ...this.getHeaders(),
        },
      );
      const data = response.data.data as User;
      return data;
    } catch (error) {
      return undefined;
    }
  }

  async addPlan(
    userId: number,
    planId: number,
    paymentMethod: string,
    authCode: string,
    paid: number | null = null,
  ) {
    try {
      const response = await axios.post<Response<User>>(
        `${this.url}/plan/${planId}/pos`,
        {
          user_id: userId,
          payment_method: paymentMethod,
          auth_code: authCode,
          paid,
        },
        this.getHeaders(),
      );
      const data = response.data.data as User;
      return data;
    } catch (error) {
      return undefined;
    }
  }

  async addCharge(
    userId: number,
    planId: number | null,
    paymentMethod: string,
    authCode: string,
    paid: number | null = null,
    credits: number,
    credit_type: 'classic' | 'online' = 'classic',
  ) {
    try {
      const response = await axios.post<Response<User>>(
        `${this.url}/charges/`,
        {
          user_id: userId,
          payment_method: paymentMethod,
          auth_code: authCode,
          paid,
          credits,
          credit_type,
        },
        this.getHeaders(),
      );
      const data = response.data.data as User;
      return data;
    } catch (error) {
      return undefined;
    }
  }

  async reservations(
    id: number,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ data: Reservation[]; count: number } | undefined> {
    try {
      const response = await axios.get<Response<Reservation>>(
        `${this.url}/reserve/?user_id=${id}`,
        {
          ...this.getHeaders(),
          params: {
            per_page: pageSize,
            page: page,
          },
        },
      );
      const data = response.data.data as Reservation[];
      const count = response.headers['content-count'];
      return { data: data, count };
    } catch (error) {
      return undefined;
    }
  }

  async reduceCredits(
    id: number,
    type: 'online' | 'classic',
    typeLesson?: string,
  ) {
    try {
      const response = await axios.post<Response<User>>(
        `${this.url}/user/${id}/credit`,
        { type, typeLesson },
        {
          ...this.getHeaders(),
        },
      );

      const data = response.data.data as User;
      return data;
    } catch (error) {
      return undefined;
    }
  }

  async pauseValidity(id: string | number) {
    try {
      const response = await axios.get<Response<User>>(
        `${this.url}/user/${id}/pause`,
        {
          ...this.getHeaders(),
        },
      );
      const data = response.data.data as User;
      return data;
    } catch (error) {
      return undefined;
    }
  }

  async reactivateValidity(userId: string | number) {
    try {
      const response = await axios.get<Response<User>>(
        `${this.url}/user/${userId}/reactivate`,
        { ...this.getHeaders() },
      );
      const data = response.data.data as User;
      return data;
    } catch (error) {
      return undefined;
    }
  }
}

const service = new AuthService();
export default service;
