import { Model, Response } from "../Service/Service";
import axios from 'axios';
import BaseService from "../BaseService";
import { Credit } from "../Credit/Credit";
import { OnlineCredit } from "../OnlineCredit/OnlineCredit";

export interface Purchase extends Model {
    card_last4: string;
    created_at: string;
    paid: number;
    plan_name: string;
    payment_type: string;
    status: string;
    auth_code: number;
    credits: Credit[];
    online_credits: OnlineCredit[];
}

class PurchasesService extends BaseService {
    protected name = 'charges';
    protected url: string | undefined = `${process.env.REACT_APP_API_URL}/${this.name}`;

    async find(page: number = 1, pageSize: number = 10): Promise<{ data: Purchase[], count: number } | string> {
        try {
            const response = await axios.get<Response<Purchase>>(
                `${this.url}`,
                {
                    ...this.getHeaders(),
                    params: {
                        per_page: pageSize,
                        page: page,
                    }
                },
            );
            const data = response.data.data as Purchase[];
            const count = response.headers['content-count'];
            return { data: data, count };
        } catch (error) {
            if (error.response) {
                return error.response.data.message;
            } else {
                return 'Ocurrió un problema al obtener tu historial de compras.';
            }
        }
    }
}

const service = new PurchasesService();
export default service;
