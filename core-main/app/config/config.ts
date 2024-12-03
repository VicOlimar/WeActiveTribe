import * as ip from 'ip';
import * as path from 'path';
import { Dialect } from 'sequelize/types/lib/sequelize';

export const config = {
  root: path.normalize(`${__dirname}/..`),

  env: process.env.NODE_ENV || 'development',

  date_format: {
    date: 'DD/MM/YYYY',
    time: 'h:mm a',
  },

  jwt: {
    max_valid_days_after_exp: 15,
    secret:
      process.env.JWT_SECRET || 'P_8q1A9Bvh_3THkcNZMlgsNYwWCJLh1tFo6RlNGeC84',
    access: {
      expiry: {
        unit: 'months',
        length: 2,
      },
      subject: 'access',
      audience: 'user',
    },
    refresh: {
      expiry: {
        unit: 'months',
        length: 12,
      },
      subject: 'refresh',
      audience: 'user',
    },
    reset: {
      expiry: {
        unit: 'hours',
        length: 12,
      },
      subject: 'reset',
      audience: 'user',
    },
  },

  email: {
    fromAddress:
      process.env.EMAIL_FROM_ADDRESS || 'MyApp <no-reply@example.com>',
    auth: {
      api_key: process.env.EMAIL_API_KEY || '(your mailgun api key)',
      domain: process.env.EMAIL_DOMAIN || '(your mailgun domain)',
    },
  },

  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY
  },

  mailchimp: {
    apiKey: process.env.MAILCHIMP_API_KEY,
    list_id: process.env.MAILCHIMP_LIST_ID
  },

  conekta: {
    private_key: process.env.CONEKTA_PRIVATE_KEY,
    public_key: process.env.CONEKTA_PUBLIC_KEY,
  },

  paypal: {
    api_url: process.env.PAYPAL_API_URL,
    api_client_id: process.env.PAYPAL_API_CLIENT_ID,
    api_client_secret: process.env.PAYPAL_API_CLIENT_SECRET,
  },

  twilio: {
    sid: process.env.TWILIO_SID,
    token: process.env.TWILIO_TOKEN,
    phone: process.env.TWILIO_PHONE,
  },

  onesignal: {
    api_url: process.env.ONE_SIGNAL_API_URL,
    app_id: process.env.ONE_SIGNAL_APP_ID,
    rest_api_key: process.env.ONE_SIGNAL_REST_API_KEY,
  },

  bugsnag_key: process.env.BUGSNAG_KEY,

  s3: {
    access_key: process.env.AWS_ACCESS_KEY_ID,
    secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: process.env.AWS_ENDPOINT || false,
    bucket_name: process.env.AWS_BUCKET,
  },

  server: {
    port: process.env.SERVER_PORT || process.env.PORT || 8888,
  },

  log: {
    // Console Log levels: error, warn, info, verbose, debug, silly
    level: process.env.LOG_LEVEL || 'debug',
  },

  urls: {
    // Url config as seen from the user NOT NECESSARILY THE SAME AS SERVER
    // http or https
    protocol: process.env.URLS_PROTOCOL || 'http',
    url: process.env.URLS_URL || ip.address(),
    port: process.env.URLS_PORT ? String(process.env.URLS_PORT) : '',
    apiRoot: process.env.URLS_API_ROOT || '/api/v1',
    base: null,
    baseApi: process.env.CLIENT_URL || 'https://weactive.mx',
  },

  db: {
    database: process.env.DB_NAME || 'we-cycling',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST || 'localhost',
    dialect: (process.env.DB_DIALECT || 'postgres') as Dialect,
    storage: process.env.DB_DIALECT === 'sqlite' ? './db.sqlite' : null,
    logging: false,
    dialectOptions: {
      useUTC: false, // -->Add this line. for reading from database
      ssl: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging'
    },
    timezone: '-06:00',
    //storage: 'db.sqlite',
  }
};

let portString = '';
if (Number.isInteger(parseInt(config.urls.port))) {
  portString = `:${config.urls.port}`;
}

config.urls.base = `${config.urls.protocol}://${config.urls.url}${portString}`;
config.urls.baseApi = `${config.urls.base}${config.urls.apiRoot}`;
