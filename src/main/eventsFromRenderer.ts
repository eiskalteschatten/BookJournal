import { ipcMain, IpcMainEvent, BrowserWindow } from 'electron';

import Preferences from './db/models/Preferences';

ipcMain.on('savePreferences', async (event: IpcMainEvent, arg: any): Promise<void> => {
  const preferences = await Preferences.findByPk(1);
  await preferences.update(arg);

  const browserWindow = BrowserWindow.getFocusedWindow();
  browserWindow?.webContents.send('preferencesSetAll', preferences.get({ plain: true }));
});
