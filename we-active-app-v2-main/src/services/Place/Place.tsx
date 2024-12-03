import {Model} from '../Service/Service';

export interface Place extends Model {
  location: string;
  studio_id: number;
}
