import * as i18n from 'i18n';
import * as path from 'path';

i18n.configure({
  locales: ['en', 'es'],
  directory: path.join(__dirname, '/../locales'),
  updateFiles: true,
  syncFiles: true,
  defaultLocale: 'es',
});

export default i18n;
