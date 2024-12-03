import {LessonType} from '../Lesson/Lesson';
import {Model, Service} from '../Service/Service';

export interface Credit extends Model {
  expires_at: Date;
  canceled: boolean;
  used: boolean;
  lesson_type_id: number;
  lesson_type: LessonType;
}

export class CreditService extends Service<Credit> {
  protected name = 'credit';
}

const service = new CreditService();
export default service;
