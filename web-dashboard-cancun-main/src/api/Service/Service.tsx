import axios from 'axios';

export interface Model {
    id: number | string;
    [prop: string]: any;
}

export interface Response<T extends Model> {
    status: number;
    message: string;
    data: T[] | T;
}

export abstract class Service<T extends Model> {

    protected name: string | undefined = undefined;
    protected url: string | undefined = process.env.REACT_APP_API_URL;

    async find(): Promise<T[]> {
        const response = await axios.get<Response<T>>(`${this.url}/${this.name}`);
        return response.data.data as T[];
    }

    async findOne(id:number): Promise<T> {
        const response = await axios.get<Response<T>>(`${this.url}/${this.name}/${id}`);
        return response.data.data as T;
    }

    async create(instance:T): Promise<T> {
        const response = await axios.get<Response<T>>(`${this.url}/${this.name}/`);
        return response.data.data as T;
    }
}