var path = process.env.NODE_ENV === 'test' ? './.env.test' : './.env';
require('dotenv').config({ path: path });

var env = process.env.NODE_ENV || 'development';

var ssl = {
  sslmode: 'require',
  rejectUnauthorized: false,
};

var db = {
  database: process.env.DB_NAME || 'we-cycling',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || 'localhost',
  dialect: process.env.DB_DIALECT || 'postgres',
  storage: process.env.DB_DIALECT === 'sqlite' ? './db.sqlite' : null,
  dialectOptions: {
    useUTC: false,
    ssl: env === 'production' || env === 'staging' ? ssl : false,
  },
  ssl: env === 'production' ? ssl : false,
  timezone: 'America/Merida',
};

module.exports = {
  [env]: db,
};
