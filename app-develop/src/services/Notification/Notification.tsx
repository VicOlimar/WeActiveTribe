import Axios from 'react-native-axios';
import { Model, Response } from '../Service/Service';
import BaseService from '../BaseService/BaseService';

export interface BaseResponse {
  status: number;
  message: string;
}
export interface NotificationResponse extends BaseResponse {
  data: Notification [];
};

export interface Notification extends BaseService {
  id: number,
  api_id: string,
  title: string,
  subtitle: string,
  content: string,
  user_id: number,
  created_at: string
}

export class NotificationService extends BaseService {

  async getUserNotification(user_id: number): Promise<any | string> {
    try {
      const header = await this.getHeaders();
      const response = await Axios.get<NotificationResponse>(`${this.url}/notifications?user_id=${user_id}`, header);
      return response.data.data;
    } catch (error) {
      throw new Error('Error en consulta de notificaciones');
    }
  }

}

const notificationService = new NotificationService();
export default notificationService;
