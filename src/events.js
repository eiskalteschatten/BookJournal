'use strict';

const {ipcRenderer} = require('electron');
const $ = require('jquery');

const helper = require('./events/helper');

require('./events/sidebar');
require('./events/categories');
require('./events/books');
require('./events/dragbar');


$(document).on('contextmenu', 'input, textarea', function() { // eslint-disable-line
    ipcRenderer.send('show-input-context-menu');
});

ipcRenderer.on('reload-window', helper.reloadWindow);

if (process.platform === 'darwin') {
    require('./events/macos');
}
