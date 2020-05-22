import { BrowserWindow } from 'electron';

import Preferences from './db/models/Preferences';

export default (browserWindow: BrowserWindow, preferences: Preferences): void => {
  browserWindow.webContents.send('preferencesSetAll', preferences);
};
