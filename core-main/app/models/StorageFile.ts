import {
  Table,
  Column,
  DataType,
  Model,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  AfterDestroy,
} from 'sequelize-typescript';
import { s3 } from '../libraries/s3';
import { config } from '../config/config';

@Table
export class StorageFile extends Model<StorageFile> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  key: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  mimetype: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  etag: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  getUrlFile() {
    return s3.getSignedUrl('getObject', {
      Bucket: config.s3.bucket_name,
      Key: this.key,
      ResponseContentType: this.mimetype,
      IfMatch: this.etag,
    });
  }

  @AfterDestroy
  static async destroyS3File(storagefile: StorageFile, options: any) {
    try {
      await s3
        .deleteObject({
          Bucket: config.s3.bucket_name,
          Key: storagefile.key,
        })
        .promise();
    } catch (err) {}
  }
}
