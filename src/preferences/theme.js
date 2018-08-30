'use strict';

const {Menu} = require('electron');
const Preferences = require('../models/preferences');


async function changeTheme(theme, window) {
    try {
        const preferences = await Preferences.findById(1);
        await preferences.update({theme});

        window.webContents.send('switch-css', theme);

        const menuItem = `${theme}Theme`;
        const menu = Menu.getApplicationMenu();
        menu.getMenuItemById(menuItem).checked = true;
        menu.getMenuItemById('lightTheme').checked = false;
        menu.getMenuItemById('darkTheme').checked = false;
        menu.getMenuItemById(menuItem).checked = true;
    }
    catch(error) {
        console.error(error);
    }
}

async function getCurrentTheme() {
    try {
        const preferences = await Preferences.findById(1);
        return preferences.theme;
    }
    catch(error) {
        console.error(error);
    }
}


module.exports = {
    changeTheme,
    getCurrentTheme
};