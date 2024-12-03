import * as SegfaultHandler from 'segfault-handler';
import * as pino from 'pino';
import * as expressRequestLogger from 'express-pino-logger';
import * as prettifier from 'pino-pretty';
import * as fs from 'fs';
import * as path from 'path';
import { config } from './../config/config';
import { isUndefined } from 'util';

let prettyPrint;

if (config.env === 'development') {
  prettyPrint = { colorize: true }
} else {
  prettyPrint = false;
}

export const log = pino({
  prettyPrint,
  prettifier
});

export const requestLogger = expressRequestLogger({
  logger: log
});
