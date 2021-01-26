import { remote } from 'electron';

import path from 'path';

import checkForUpdates from './checkForUpdates';
import SidebarList from './elements/list/sidebar';
import AboutModal from './elements/modal/about';

const { BrowserWindow } = remote;

async function renderSidebar(): Promise<void> {
  const list = new SidebarList();
  await list.loadCategories();

  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = await list.render();
}

async function renderModals(): Promise<void> {
  let rendered = '';

  const aboutModal = new AboutModal();
  rendered += await aboutModal.render();

  document.getElementById('modalAnchor').innerHTML = rendered;
}

function createDbBackup(): void {
  const windowID = BrowserWindow.getFocusedWindow().id;
  const loadDbBackupPath = 'file://' + path.join(__dirname, './html/invisible/backup-db.html');

  const loadDbBackupWindow = new BrowserWindow({
    width: 400,
    height: 400,
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  loadDbBackupWindow.loadURL(loadDbBackupPath);
  loadDbBackupWindow.webContents.on('did-finish-load', () => {
    const input = 100;
    loadDbBackupWindow.webContents.send('backup-db', input, windowID);
  });
}

async function postRender(): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { loadPreferences } = require('./initialPreferences');
  const preferences = await loadPreferences();

  localStorage.setItem('preferences', JSON.stringify(preferences));
  localStorage.setItem('theme', preferences.theme);

  checkForUpdates();
  createDbBackup();
}

async function render(): Promise<void> {
  require('./events.js');

  const sortBy = localStorage.getItem('sortBy');
  if (sortBy) (document.getElementById('bookSort') as HTMLInputElement).value = sortBy;

  const sortOrder = localStorage.getItem('sortOrder');
  if (sortOrder === 'DESC') document.getElementById('bookSortOrder').innerHTML = '&darr;';

  await renderSidebar();
  const firstSidebarListItem = document.getElementsByClassName('js-sidebar-list-element')[0] as HTMLElement;
  firstSidebarListItem.click();

  document.getElementById('defaultCss').remove();

  await renderModals();
  await postRender();
}

render();
