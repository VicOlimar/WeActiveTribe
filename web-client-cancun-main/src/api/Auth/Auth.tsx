import axios from 'axios';
import { Model, Response } from '../Service/Service';
import BaseService from '../BaseService';
import { Credit } from '../Credit/Credit';
import { OnlineCredit } from '../OnlineCredit/OnlineCredit';

export interface BaseResponse {
  status: number;
  message: string;
}
export interface AuthResponse extends BaseResponse {
  data: {
    token: {
      token: string;
      expires: number;
      expires_in: number;
    };
    refresh_token: {
      token: string;
      expires: number;
      expires_in: number;
    };
    user: User;
    profile: Profile;
  };
};

export interface LoggedResponse extends BaseResponse {
  data: {
    user: User;
    profile: Profile;
    credits: {
      to_expire: number;
      available: number;
    }
  };
}

export interface User extends Model {
  email: string,
  name: string,
  last_name: string,
  profile: Profile,
  role: string,
}

export interface Profile extends Model {
  locale: string,
  payment_key?: string,
  phone?: string,
  time_zone: string,
  user_id: number,
  birthdate: Date,
  emergency_contact: string,
  emergency_contact_name: string,
  created_at: string,
  updated_at: string,
  deleted_at: string,
}

export interface MeResponse extends BaseResponse {
  data: {
    credits: {
      to_expire: number;
      available: number;
    }
  }
}

export interface Me {
  credits: {
    to_expire: number;
    online_to_expire: number;
    available_online: number;
    available_online_data: OnlineCredit[];
    available: number;
    available_data: Credit[];
  },
  reserves: {
    next_reserves: number;
  }
}

export interface UserProfile extends Model {
  user: User,
  profile: Profile,
}

export class AuthService extends BaseService {

  protected url: string | undefined = process.env.REACT_APP_API_URL;

  async login(email: string, password: string): Promise<any | string> {
    try {
      const response = await axios.post<AuthResponse>(`${this.url}/auth/login`, {
        email, password
      });
      if (response.data.status !== 400) {
        return response.data.data as any;
      } else {
        return response.data.message;
      }
    } catch (error) {
      return 'Correo o contraseña inválidos.';
    }
  }

  async register(
    {
      email,
      password,
      name,
      last_name,
      phone,
      emergency_contact,
      emergency_contact_name,
    }: {
      email: string,
      password: string,
      name: string,
      last_name: string,
      phone: string,
      emergency_contact: string,
      emergency_contact_name: string,
    }
  ) {
    try {
      const response = await axios.post<AuthResponse>(`${this.url}/auth/register`, {
        email, password, name, last_name, phone, emergency_contact, emergency_contact_name
      });

      if (response.data.status !== 400) {
        return response.data.data as any;
      } else {
        return response.data.message;
      }
    } catch (error) {
      if ((error as any).response) {
        return (error as any).response.data.message;
      } else {
        return (error as any).message;
      }
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

  async refreshToken(token: string): Promise<any | string> {
    try {
      const response = await axios.post<AuthResponse>(`${this.url}/auth/refresh`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const { data: axiosData } = response;
      return axiosData.data as any;
    } catch (error) {
      if (error.response) {
        return error.response.data.message;
      } else {
        return 'Ocurrió un problema al actualizar tu token, vuelve a iniciar sesión';
      }
    }
  }

  async updateProfile(profile: any): Promise<UserProfile | undefined> {
    try {
      const response = await axios.post<Response<UserProfile>>(
        `${this.url}/user/me`,
        {
          user: {
            name: profile.name,
            last_name: profile.last_name,
            email: profile.email,
          },
          profile: {
            time_zone: profile.time_zone,
            phone: profile.phone,
            locale: profile.locale,
            birthdate: profile.birthdate,
            emergency_contact: profile.emergency_contact,
            emergency_contact_name: profile.emergency_contact_name,
          }
        },
        this.getHeaders(),
      );
      const { data: axiosData } = response;
      return axiosData.data as UserProfile;
    } catch (error) {
      return undefined;
    }
  }

  async resetPassword(email: string): Promise<any | string> {
    try {
      const response = await axios.post<any>(
        `${this.url}/auth/reset`,
        {
          email,
        }
      );
      const { data: axiosData } = response;
      return axiosData.data as any;
    } catch (error) {
      if (error.response) {
        return error.response.data.message;
      } else {
        return 'Ocurrió un error al iniciar el proceso de recuperación.';
      }

    }
  }

  async changePassword(token: any, password: string): Promise<any | string> {
    try {
      const response = await axios.post<any>(
        `${this.url}/auth/reset`,
        {
          token,
          password,
        }
      );
      const { data: axiosData } = response;
      return axiosData.data as any;
    } catch (error) {
      if (error.response) {
        return error.response.data.message;
      } else {
        return 'Ocurrió un error al reiniciar tu contraseña.';
      }

    }
  }

}

const service = new AuthService();
export default service;
