import Axios from 'axios';
import {Model, Response} from '../Service/Service';
import BaseService from '../BaseService/BaseService';
import {OnlineCredit} from '../OnlineCredit/OnlineCredit';
import {Credit} from '../Credit/Credit';
import { AuthState } from '../../contexts/UserContext/types';

export interface BaseResponse {
  status: number;
  message: string;
}
export interface AuthResponse extends BaseResponse {
  data: AuthState;
}

export interface LoggedResponse extends BaseResponse {
  data: {
    user: User;
    profile: Profile;
    credits: {
      to_expire: number;
      available: number;
    };
  };
}

export interface User extends Model {
  email: string;
  name: string;
  last_name: string;
  profile: Profile;
  role: string;
  birthdate: Date;
  emergency_contact: string;
}

export interface Profile extends Model {
  locale: string;
  payment_key?: string;
  phone?: string;
  time_zone: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export interface MeResponse extends BaseResponse {
  data: {
    credits: {
      to_expire: number;
      available: number;
    };
  };
}

export interface Me {
  user?: {
    name: string;
    last_name: string;
    email: string;
  };
  profile?: {
    phone: string;
    birthdate: string;
    emergency_contact: string;
    emergency_contact_name: string;
    notifications: boolean;
  };
  credits?: {
    to_expire: number;
    online_to_expire: number;
    available_online: number;
    available_online_data: OnlineCredit[];
    available: number;
    available_data: Credit[];
  };
  reserves?: {
    next_reserves: number;
  };
}

export interface UserProfile extends Model {
  user: User;
  profile: Profile;
}

export class AuthService extends BaseService {
  async login(email: string, password: string): Promise<AuthState> {
    try {
      const body = {
        email: email,
        password: password,
        mobile_login: true,
      };
      const response = await Axios.post<AuthResponse>(
        `${this.url}/auth/login`,
        body,
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error('Correo o contraseña inválidos.');
    }
  }

  async register(
    email: string,
    password: string,
    name: string,
    last_name: string | null = null,
  ) {
    try {
      const body = {
        email,
        password,
        name,
        last_name,
      };
      const response = await Axios.post<AuthResponse>(
        `${this.url}/auth/register`,
        body,
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error('Hubo un problema, intenta más tarde.');
    }
  }

  async me(): Promise<Me | undefined> {
    const header = await this.getHeaders();
    const response = await Axios.get<MeResponse>(`${this.url}/user/me`, header);
    const {data: axiosData} = response;
    return axiosData.data as Me;
  }

  async refreshToken(token: string): Promise<any | string> {
    try {
      const response = await Axios.post<AuthResponse>(
        `${this.url}/auth/refresh`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const {data: axiosData} = response;
      return axiosData.data as any;
    } catch (error: any) {
      if (error.response) {
        return error.response.data.message;
      } else {
        return 'Ocurrió un problema al actualizar tu token, vuelve a iniciar sesión';
      }
    }
  }

  async updateProfile(profile: Me): Promise<UserProfile | undefined> {
    try {
      const header = await this.getHeaders();
      const response = await Axios.post<Response<UserProfile>>(
        `${this.url}/user/me`,
        {
          user: {
            name: profile.user?.name,
            last_name: profile.user?.last_name,
            email: profile.user?.email,
          },
          profile: {
            phone: profile.profile?.phone,
            birthdate: profile.profile?.birthdate,
            emergency_contact: profile.profile?.emergency_contact,
            emergency_contact_name: profile.profile?.emergency_contact_name,
            notifications: profile.profile?.notifications,
          },
        },
        header,
      );
      const {data: axiosData} = response;
      return axiosData.data as UserProfile;
    } catch (error: any) {
      return undefined;
    }
  }

  async resetPassword(email: string): Promise<any | string> {
    try {
      const response = await Axios.post<any>(`${this.url}/auth/reset`, {
        email,
      });
      const {data: axiosData} = response;
      return axiosData.data as any;
    } catch (error: any) {
      if (error.response) {
        return error.response.data.message;
      } else {
        return 'Ocurrió un error al iniciar el proceso de recuperación.';
      }
    }
  }

  async changePassword(
    oldPass: string,
    newPass: string,
  ): Promise<any | string> {
    try {
      const header = await this.getHeaders();
      const response = await Axios.post<any>(
        `${this.url}/auth/change`,
        {
          oldPass: oldPass,
          newPass: newPass,
        },
        header,
      );
      const {data: axiosData} = response;
      return axiosData.data as any;
    } catch (error: any) {
      const defaultMessage = 'Tu contraseña anterior no es correcta';
      if (error.response) {
        throw new Error(
          error.response.data.message === 'unauthorized'
            ? defaultMessage
            : error.response.data.message,
        );
      } else {
        throw new Error(defaultMessage);
      }
    }
  }
}

const authService = new AuthService();
export default authService;
