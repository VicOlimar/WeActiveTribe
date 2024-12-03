import { Model } from "../Service/Service";
import axios from 'axios';
import BaseService from "../BaseService";

export interface Place extends Model {
  location: string,
  studio_id: number,
}