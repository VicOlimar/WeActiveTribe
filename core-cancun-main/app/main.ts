require('dotenv').config();

import { log } from './libraries/Log';
import { setupDB } from './db';
import { setupServer } from './server';
import JanitorService from './services/JanitorService';
import * as notifier from 'node-notifier';

process.env.TZ = 'UTC'; // IMPORTANT For correct timezone management with DB, Tasks etc.

(async () => {
  try {
    await setupDB();
    JanitorService.init();
    await setupServer();
    notifier.notify('Server Ready');
  } catch (error) {
    log.error(error);
  }
})();
