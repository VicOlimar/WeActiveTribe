import axios from 'axios';
import { Model, Response } from '../Service/Service';
import BaseService from '../BaseService';

export interface Notification extends Model {
  title: string;
  subtitle: string;
  content: string;
  users: string[];
}

export class NotificationService extends BaseService {

  async send(Notification: Notification) {
    try {
      const response = await axios.post<Response<Notification>>(
        `${this.url}/notifications`,
        Notification,
        this.getHeaders()
      );
      const { data: axiosData } = response;
      return axiosData.data;
    } catch (error) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message)
      } else {
        throw new Error('Error enviando la notificación');
      }
    }
  }

}

const service = new NotificationService();
export default service;