import { LessonType } from "../Lesson/Lesson";
import { Model, Service } from "../Service/Service";
import { Studio } from "../Studio/Studio";

export interface Credit extends Model {
    expires_at: Date;
    canceled: boolean;
    used: boolean;
    lesson_type_id: number;
    lesson_type: LessonType;
    studio_id: number;
    studio: Studio
}

export class CreditService extends Service<Credit> {
    protected name = 'credit';
}

const service = new CreditService();
export default service;
