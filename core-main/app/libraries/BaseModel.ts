import { Model } from 'sequelize-typescript';

/* 
  BaseModel: 
  All models inherit from this class, 
  modify it to apply defaults to all your models.
*/

export class BaseModel<T> extends Model<T> {
  toJSON() {
    const instance: any = super.toJSON();

    delete instance.created_at;
    delete instance.updated_at;
    delete instance.deleted_at;

    return instance;
  }

  static filter(filter: string) {
    throw new Error('metho not implemented');
  }
}
