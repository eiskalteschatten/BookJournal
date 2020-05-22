import { BrowserWindow } from 'electron';

import Preferences from './db/models/Preferences';

export default (browserWindow: BrowserWindow, preferences: Preferences): void => {
  browserWindow.webContents.send('appSetPlatform', process.platform);
  browserWindow.webContents.send('preferencesSetAll', preferences);
};
