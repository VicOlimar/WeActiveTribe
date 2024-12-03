import { Model } from "../Service/Service";
import Axios from 'react-native-axios';
import BaseService from "../BaseService";

export interface Place extends Model {
  location: string,
  studio_id: number,
}
