import { Response } from "../Service/Service";

import axios from "axios";
import BaseService from "../BaseService";

export interface Cupon {
  code: string;
  discount: number;
  expires_after: Date;
  id: number;
  total_uses: number;
  type: string;
  active: boolean;
}

export interface CouponResponse {
  discounts: Cupon[];
  count: number;
}

class DiscountService extends BaseService {
  async find(
    per_page: number,
    page: number
  ): Promise<CouponResponse | undefined> {
    try {
      const response = await axios.get<Response<any>>(`${this.url}/discount`, {
        ...this.getHeaders(),
        params: { per_page: per_page, page: page },
      });
      const { data: axiosData, headers: axiosHeaders } = response;
      const dataResponse: CouponResponse = {
        discounts: axiosData.data as Cupon[],
        count: axiosHeaders["content-count"],
      };
      return dataResponse;
    } catch (error) {
      return undefined;
    }
  }

  async findOne(id: number): Promise<Cupon | undefined> {
    try {
      const response = await axios.get<Response<Cupon>>(
        `${this.url}/discount/${id}`,
        this.getHeaders()
      );
      const { data: axiosData } = response;
      return axiosData.data as Cupon;
    } catch (error) {
      return undefined;
    }
  }

  async create(
    code: string,
    total_uses: number,
    discount: number,
    type: string,
    expires_after: Date
  ): Promise<Cupon | undefined> {
    try {
      const response = await axios.post<Response<any>>(
        `${this.url}/discount/`,
        { code, total_uses, discount, type, expires_after },
        this.getHeaders()
      );
      const { data: axiosData } = response;
      return axiosData.data as Cupon;
    } catch (error) {
      return undefined;
    }
  }

  async Remove(id: number) {
    try {
      const response = await axios.delete<Response<any>>(
        `${this.url}/discount/${id}`,
        this.getHeaders()
      );
      const { status } = response;
      return status;
    } catch (error) {
      return undefined;
    }
  }

  async update(cupon: Cupon): Promise<Cupon | undefined> {
    try {
      const response = await axios.post<Response<Cupon>>(
        `${this.url}/discount/${cupon.id}`,
        {
          id: cupon.id,
          code: cupon.code,
          total_uses: cupon.total_uses,
          discount: cupon.discount,
          type: cupon.type,
          expires_after: cupon.expires_after,
          active: cupon.active,
        },
        this.getHeaders()
      );
      const { data: axiosData } = response;
      return axiosData.data as Cupon;
    } catch (error) {
      return undefined;
    }
  }
}

const discountService = new DiscountService();
export default discountService;
