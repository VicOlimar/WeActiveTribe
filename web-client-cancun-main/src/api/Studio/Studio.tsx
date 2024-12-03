import { Model, Response } from "../Service/Service";
import axios from 'axios';

export interface Studio extends Model {
    name: string;
    slug: string;
}

class StudioService {
    protected name = 'studio';
    protected url: string | undefined = process.env.REACT_APP_API_URL;

    async find(): Promise<Studio[] | null> {
        try {
            const response = await axios.get<Response<Studio>>(`${this.url}/studio`);
            const { data: axiosData } = response;
            return axiosData.data as Studio[];
        } catch (error) {
            return null;
        }
    }

    async findOne(slug: string | string): Promise<Studio | undefined> {
        try {
            const response = await axios.get<Response<Studio>>(`${this.url}/studio/${slug}`);
            const { data: axiosData } = response;
            return axiosData.data as Studio;
        } catch (error) {
            return undefined;
        }
    }

    async create(instance: Studio): Promise<Studio> {
        const response = await axios.get<Response<Studio>>(`${this.url}/studio/`);
        return response.data.data as Studio;
    }
}

const service = new StudioService();
export default service;
