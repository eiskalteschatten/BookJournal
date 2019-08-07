'use strict';

const {remote} = require('electron');
const BrowserWindow = remote.BrowserWindow;

const path = require('path');

const checkForUpdates = require('./checkForUpdates');

const SidebarList = require('./elements/list/sidebar');
const AboutModal = require('./elements/modal/about');


async function renderSidebar() {
    const list = new SidebarList();
    await list.loadCategories();

    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = await list.render();
}

async function renderModals() {
    let rendered = '';

    const aboutModal = new AboutModal();
    rendered += await aboutModal.render();

    document.getElementById('modalAnchor').innerHTML = rendered;
}

function createDbBackup() {
    const windowID = BrowserWindow.getFocusedWindow().id;
    const loadDbBackupPath = 'file://' + path.join(__dirname, './html/invisible/backup-db.html');

    const loadDbBackupWindow = new BrowserWindow({
        width: 400,
        height: 400,
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    loadDbBackupWindow.loadURL(loadDbBackupPath);
    loadDbBackupWindow.webContents.on('did-finish-load', () => {
        const input = 100;
        loadDbBackupWindow.webContents.send('backup-db', input, windowID);
    });
}

async function postRender() {
    const {loadPreferences} = require('./initialPreferences');
    const preferences = await loadPreferences();

    localStorage.setItem('preferences', JSON.stringify(preferences));
    localStorage.setItem('theme', preferences.theme);

    checkForUpdates();
    createDbBackup();
}

async function render() {
    require('./events.js');

    const sortBy = localStorage.getItem('sortBy');
    if (sortBy) document.getElementById('bookSort').value = sortBy;

    const sortOrder = localStorage.getItem('sortOrder');
    if (sortOrder === 'DESC') document.getElementById('bookSortOrder').innerHTML = '&darr;';

    await renderSidebar();
    const firstSidebarListItem = document.getElementsByClassName('js-sidebar-list-element')[0];
    firstSidebarListItem.click();

    document.getElementById('defaultCss').remove();

    await renderModals();
    await postRender();
}

render();
