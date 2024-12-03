import axios from 'axios';
import { Model, Response } from '../Service/Service';
import BaseService from '../BaseService';
import { Reservation } from '../Reservation/ReservationService';
import { User, Profile } from '../Users/Users';

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
        available: number;
    }
}

export interface UserProfile extends Model {
    user: User,
    profile: Profile,
}

export class AuthService extends BaseService {

    protected url: string | undefined = process.env.REACT_APP_API_URL;

    async login(email: string, password: string): Promise<any | null> {
        try {
            const response = await axios.post<AuthResponse>(`${this.url}/auth/login`, {
                email, password
            });
            const { data: axiosData } = response;
            return axiosData.data as any;
        } catch (error) {
            return null;
        }
    }

    async register(email: string, password: string, name: string | null = null) {
        try {
            const response = await axios.post<AuthResponse>(`${this.url}/auth/register`, {
                email, password, name
            });
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

    async lessons(page: number = 1, pageSize: number = 10): Promise<{ data: Reservation[], count: number } | undefined> {
        try {
            const response = await axios.get<Response<Reservation>>(
                `${this.url}/user/me/lessons`,
                {
                    ...this.getHeaders(),
                    params: {
                        per_page: pageSize,
                        page: page,
                    }
                },
            );
            const data = response.data.data as Reservation[];
            const count = response.headers['content-count'];
            return { data: data, count };
        } catch (error) {
            return undefined;
        }
    }

}

const service = new AuthService();
export default service;
