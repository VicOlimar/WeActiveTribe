import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { log } from './libraries/Log';
import { config } from './config/config';
import * as path from 'path';

const dbOptions: SequelizeOptions = {
  ...config.db,
  modelPaths: [path.join(__dirname, '/models')],
  define: {
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: true,
  },
};

export const db = new Sequelize(dbOptions);

// Should be called in server
export async function setupDB(): Promise<any> {
  return db.authenticate();
}
