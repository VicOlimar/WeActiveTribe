import { Model, Response } from '../Service/Service';
import axios from 'axios';
import BaseService from '../BaseService';
import { User } from '../Users/Users';
import moment from 'moment';
const FileDownload = require('js-file-download');

export interface Purchase extends Model {
  card_last4: string;
  created_at: string;
  paid: number;
  plan_name: string;
  user: User;
  order_id: number;
  currency: string;
  user_id: number;
  expires_at: Date;
}

type FilterOptions = {
  per_page?: number;
  page?: number;
  search?: string;
  orderBy?: string;
  filterBy?: string;
  filterByPlan?: string;
  start_date?: Date;
  end_date?: Date;
  format?: string;
};

class PurchasesService extends BaseService {
  protected name = 'charges';
  protected url: string | undefined =
    `${process.env.REACT_APP_API_URL}/${this.name}`;

  async find(
    page: number = 1,
    pageSize: number = 10,
    substring: string = '',
    filterBy?: string,
    filterByPlan?: string,
    orderBy?: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{ data: Purchase[]; count: number } | undefined> {
    try {
      let params: FilterOptions = {
        per_page: pageSize,
        page: page,
        search: substring,
        orderBy: orderBy,
        filterBy: filterBy,
        filterByPlan: filterByPlan,
      };

      if (startDate && endDate) {
        params.start_date = moment(startDate).utc().toDate();
        params.end_date = moment(endDate).utc().toDate();
      }

      const response = await axios.get<Response<Purchase>>(`${this.url}`, {
        ...this.getHeaders(),
        params,
      });
      const data = response.data.data as Purchase[];
      const count = response.headers['content-count'];
      return { data: data, count };
    } catch (error) {
      return undefined;
    }
  }

  async findOne(id: number): Promise<{ data: Purchase } | undefined> {
    try {
      const response = await axios.get<Response<Purchase>>(
        `${this.url}/${id}`,
        {
          ...this.getHeaders(),
        },
      );
      const data = response.data.data as Purchase;
      return { data: data };
    } catch (error) {
      return undefined;
    }
  }

  async cancelCharge(chargeId: number) {
    try {
      const response = await axios.post<Response<Purchase>>(
        `${this.url}/${chargeId}/cancel`,
        {},
        this.getHeaders(),
      );
      const data = response.data.data as Purchase;
      return { data: data };
    } catch (error) {
      return undefined;
    }
  }

  async printCsvReport(
    substring: string,
    orderBy?: string,
    filterBy?: string,
    filterByPlan?: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    try {
      let params: FilterOptions = {
        search: substring,
        orderBy: orderBy,
        filterBy: filterBy,
        filterByPlan: filterByPlan,
        format: 'csv',
      };

      if (startDate && endDate) {
        params.start_date = moment(startDate).utc().toDate();
        params.end_date = moment(endDate).utc().toDate();
      }

      const response = await axios.get<Response<Purchase>>(`${this.url}/`, {
        ...this.getHeaders(),
        params,
      });
      const data = response.data.data;
      const { status } = response;
      const now = moment().format('DD-MM-YYYY');
      FileDownload(data, `Pagos-${now}.csv`);
      return status;
    } catch (error) {
      return (error as any).message;
    }
  }

  async findByUsrId(
    page: number = 1,
    pageSize: number = 10,
    id: number,
    filterBy?: string,
    orderBy?: string,
  ): Promise<{ data: Purchase[]; count: number } | undefined> {
    try {
      const response = await axios.get<Response<Purchase>>(`${this.url}/`, {
        ...this.getHeaders(),
        params: {
          per_page: pageSize,
          page: page,
          user_id: id,
          filterBy,
          orderBy,
        },
      });
      const data = response.data.data as Purchase[];
      const count = response.headers['content-count'];
      return { data: data, count };
    } catch (error) {
      return undefined;
    }
  }
}

const service = new PurchasesService();
export default service;
