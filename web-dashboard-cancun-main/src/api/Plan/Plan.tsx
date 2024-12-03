import { Model, Response } from "../Service/Service";
import axios from 'axios';
import { User } from "../Users/Users";
import BaseService from "../BaseService";

export enum EPlanExpiresUnit {
  DAYS = 'days',
  YEARS = 'years',
  MONTHS = 'months',
}

export enum ECreditType {
  ONLINE = 'online',
  CLASSIC = 'classic',
}

export interface Plan extends Model {
    name: string,
    credits: number,
    lessons: number,
    price: number,
    special: boolean,
    expires_numbers: number,
    expires_unit: EPlanExpiresUnit,
    status: boolean,
    active: boolean,
    active_mobile: boolean,
    credit_type: ECreditType
}

export interface PlansArrayResponse {
    plans: Plan[],
    count: number
}

export interface PlanPurcharseResponse extends Model {
    user: User,
    plan: Plan,
    card_id: string,
    discount: any,
}

class PlanService extends BaseService {

    protected url: string | undefined = process.env.REACT_APP_API_URL;

    async find(
        per_page: number,
        page: number,
        orderBy?: string
    ): Promise<PlansArrayResponse | string> {
        try {
            const response = await axios.get<Response<any>>(
                `${this.url}/plan`,
                {
                    ...this.getHeaders(),
                    params: {
                        per_page: per_page,
                        page: page,
                        orderBy
                    }
                }
            );
            if (response.data.status < 400) {
                const data: PlansArrayResponse = {
                    plans: response.data.data,
                    count: response.headers['content-count']
                }
                return data as PlansArrayResponse;
            } else {
                return response.data.message;
            }
        } catch (error) {
            if (error.response) {
                return error.response.data.message;
            } else {
                return error.message;
            }
        }
    }

    async findOne(id: number): Promise<Plan | string> {
        try {
            const response = await axios.get<Response<Plan>>(`${this.url}/plan/${id}`);
            if (response.data.status < 400) {
                return response.data.data as Plan;
            } else {
                return response.data.message;
            }
        } catch (error) {
            if (error.response) {
                return error.response.data.message;
            } else {
                return error.message;
            }
        }
    }

    async purchase(id: number, card_id: string): Promise<PlanPurcharseResponse | string> {
        try {
            const response = await axios.post<Response<PlanPurcharseResponse>>(
                `${this.url}/plan/${id}/purchase`,
                {
                    card_id,
                },
                this.getHeaders()
            );
            if (response.data.status < 400) {
                return response.data.data as PlanPurcharseResponse;
            } else {
                return response.data.message;
            }
        } catch (error) {
            if (error.response) {
                return error.response.data.message;
            } else {
                return error.message;
            }
        }
    }

    async update(
        id: number,
        name: string,
        price: number,
        credits: number,
        expires_numbers: number,
        expires_unit: string,
        special: boolean,
        credit_type: ECreditType,
        lesson_type_id: number | undefined,
        studio_id: number | undefined,
    ): Promise<Plan | string> {
        try {
            const response = await axios.post<Response<Plan>>(
                `${this.url}/plan/${id}`,
                {
                    name,
                    price,
                    credits,
                    expires_numbers,
                    expires_unit,
                    special,
                    credit_type,
                    lesson_type_id: lesson_type_id || null,
                    studio_id: studio_id || null
                },
                this.getHeaders()
            );
            if (response.data.status < 400) {
                return response.data.data as Plan;
            } else {
                return response.data.message;
            }
        } catch (error) {
            if (error.response) {
                return error.response.data.message;
            } else {
                return error.message;
            }
        }
    }

    async changeStatus(id: number, status?: boolean, status_mobile?: boolean): Promise<Plan | string> {
        try {
            const response = await axios.post<Response<Plan>>(
                `${this.url}/plan/${id}/status`,
                {
                    status: status || false,
                    status_mobile: status_mobile || false,
                },
                this.getHeaders()
            );

            if (response.data.status < 400) {
                return response.data.data as Plan;
            } else {
                return response.data.message;
            }
        } catch (error) {
            if (error.response) {
                return error.response.data.message;
            } else {
                return error.message;
            }
        }
    }

    async create(
        name: string,
        price: number,
        credits: number,
        expires_numbers: number,
        expires_unit: string,
        special: boolean,
        credit_type: ECreditType,
        lesson_type_id: number | undefined,
        studio_id: number | undefined,
    ): Promise<Plan | string> {
        try {
            const response = await axios.post<Response<Plan>>(
                `${this.url}/plan/`,
                {
                    name,
                    price,
                    credits,
                    expires_numbers,
                    expires_unit,
                    special,
                    active: true,
                    credit_type,
                    lesson_type_id,
                    studio_id
                },
                this.getHeaders()
            );
            if (response.data.status < 400) {
                return response.data.data as Plan;
            } else {
                return response.data.message;
            }
        } catch (error) {
            if (error.response) {
                return error.response.data.message;
            } else {
                return error.message;
            }
        }
    }

    async remove(id: number): Promise<any | string> {
        try {
            const response = await axios.delete<Response<Plan>>(
                `${this.url}/plan/${id}`,
                this.getHeaders()
            );
            if (response.data.status < 400) {
                return response.data.data as Plan;
            } else {
                return response.data.message;
            }
        } catch (error) {
            if (error.response) {
                return error.response.data.message;
            } else {
                return error.message;
            }
        }
    }
}

const service = new PlanService();
export default service;
