'use strict';

const { ipcRenderer, Menu } = require('electron');
const $ = require('jquery');

const Preferences = require('../../models/preferences');


async function changeTheme(theme, window) {
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
}

async function getCurrentTheme() {
  try {
    const preferences = await Preferences.findByPk(1);
    return preferences.theme;
  }
  catch (error) {
    console.error(error);
  }
}

function switchMenu(theme) {
  const menuItem = `${theme}Theme`;
  const menu = Menu.getApplicationMenu();
  menu.getMenuItemById('lightTheme').checked = false;
  menu.getMenuItemById('darkTheme').checked = false;
  menu.getMenuItemById(menuItem).checked = true;
}


module.exports = {
  changeTheme,
  getCurrentTheme,
  switchMenu,
};
