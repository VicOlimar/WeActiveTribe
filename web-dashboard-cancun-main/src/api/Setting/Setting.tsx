import axios from 'axios';
import BaseService from "../BaseService";
import { Response } from "../Service/Service";

export interface Setting {
    id: number;
    key: string;
    value: string;
}

class SettingService extends BaseService {
    protected url: string | undefined = process.env.REACT_APP_API_URL;

    async getPaymentGateway(): Promise<string> {
        try {
            const response = await axios.get<Response<Setting>>(
                `${this.url}/setting/payment_gateway`,
                this.getHeaders()
            );
            if (response.data.status < 400 && response.data.data) {
                if (Array.isArray(response.data.data)) {
                    return response.data.data[0].value;
                } else {
                    return response.data.data.value;
                }
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            if (error.response) {
                return error.response.data.message;
            } else {
                return error.message;
            }
        }
    }

    async updatePaymentGateway(gateway: 'stripe' | 'conekta'): Promise<string> {
        try {
            const response = await axios.put<Response<Setting>>(
                `${this.url}/setting/payment_gateway`,
                { value: gateway },
                this.getHeaders()
            );
            if (response.data.status < 400 && response.data.data) {
                if (Array.isArray(response.data.data)) {
                    return response.data.data[0].value;
                } else {
                    return response.data.data.value;
                }
            } else {
                throw new Error(response.data.message);
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

const settingService = new SettingService();
export default settingService;