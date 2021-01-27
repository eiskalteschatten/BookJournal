import { ipcRenderer, Menu, BrowserWindow } from 'electron';
import $ from 'jquery';

import Preferences from '../../models/preferences';


export const changeTheme = async (theme: string, window: BrowserWindow): Promise<void> => {
  try {
    const preferences = await Preferences.findByPk(1);
    await preferences.update({ theme });

    window.webContents.send('switch-theme', theme);

    if (process.type === 'renderer') {
      ipcRenderer.send('switch-theme', theme);
      $('.js-preferences-theme-image').removeClass('selected');
      $(`.js-preferences-theme[data-theme="${theme}"]`).find('.js-preferences-theme-image').addClass('selected');
    }
    else {
      switchMenu(theme);
    }
  }
  catch (error) {
    console.error(error);
  }
};

export const getCurrentTheme = async (): Promise<string> => {
  try {
    const preferences = await Preferences.findByPk(1);
    return preferences.theme;
  }
  catch (error) {
    console.error(error);
  }
};

export const switchMenu = (theme: string): void => {
  const menuItem = `${theme}Theme`;
  const menu = Menu.getApplicationMenu();
  menu.getMenuItemById('lightTheme').checked = false;
  menu.getMenuItemById('darkTheme').checked = false;
  menu.getMenuItemById(menuItem).checked = true;
};
