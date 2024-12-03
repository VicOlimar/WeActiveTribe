import { LessonType } from "../Lesson/Lesson";
import { Model, Service } from "../Service/Service";

export interface OnlineCredit extends Model {
    expires_at: Date;
    canceled: boolean;
    used: boolean;
    lesson_type_id: number;
    lesson_type: LessonType;
}

export class OnlineCreditService extends Service<OnlineCredit> {
    protected name = 'credit';
}

const service = new OnlineCreditService();
export default service;
