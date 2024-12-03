import * as S3 from 'aws-sdk/clients/s3';
import { config } from '../config/config';

const s3config: S3.Types.ClientConfiguration = {
  credentials: {
    accessKeyId: config.s3.access_key,
    secretAccessKey: config.s3.secret_access_key,
  },
};

if (config.s3.endpoint) {
  s3config.endpoint = config.s3.endpoint as string;
}

export const s3 = new S3(s3config);
