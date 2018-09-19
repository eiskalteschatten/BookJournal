'use strict';

const {ipcRenderer} = require('electron');
const $ = require('jquery');

const helper = require('./events/helper');
const checkForUpdates = require('./checkForUpdates');

require('./events/sidebar');
require('./events/categories');
require('./events/books');
require('./events/dragbar');
require('./events/statistics');
require('./events/modal');


$(document).on('contextmenu', 'input, textarea', function() {
    ipcRenderer.send('show-input-context-menu');
});

ipcRenderer.on('switch-css', (event, theme) => {
    helper.switchCss(`${theme}Css`);
    localStorage.setItem('theme', theme);
});

ipcRenderer.on('check-for-updates', async () => {
    checkForUpdates(true);
});


if (process.platform === 'darwin') {
    require('./events/macos');
}
