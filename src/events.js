'use strict';

const {ipcRenderer} = require('electron');
const $ = require('jquery');

require('./events/sidebar');
require('./events/categories');
require('./events/dragbar');

$(document).on('contextmenu', 'input, textarea', function() { // eslint-disable-line
    ipcRenderer.send('show-input-context-menu');
});

if (process.platform === 'darwin') {
    require('./events/macos');
}
