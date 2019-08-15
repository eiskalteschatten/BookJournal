'use strict';

const {ipcRenderer, shell} = require('electron');
const $ = require('jquery');

const helper = require('./events/helper');
const checkForUpdates = require('./checkForUpdates');

require('./events/sidebar');
require('./events/categories');
require('./events/books');
require('./events/dragbar');
require('./events/statistics');
require('./events/modal');
require('./events/forms');


$(document).on('contextmenu', 'input, textarea', function() {
    ipcRenderer.send('show-input-context-menu');
});

ipcRenderer.on('switch-theme', (event, theme) => {
    helper.switchCss(`${theme}Css`);
    localStorage.setItem('theme', theme);

    const $statisticsItem = $('.js-sidebar-list-element[data-query-type="statistics"]');
    if ($statisticsItem.hasClass('selected')) $statisticsItem.trigger('click');
});

ipcRenderer.on('check-for-updates', async () => {
    checkForUpdates(true);
});

$(document).on('click', '.js-external-link', function(e) {
    e.preventDefault();
    const href = $(this).attr('href');
    shell.openExternal(href);
});

if (process.platform === 'darwin') {
    require('./events/macos');
}
