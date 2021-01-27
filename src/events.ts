import { ipcRenderer, shell, IpcRendererEvent } from 'electron';
import $ from 'jquery';

import { switchCss } from './events/helper';
import checkForUpdates from './checkForUpdates';

import './events/sidebar';
import './events/categories';
import './events/books';
import './events/dragbar';
import './events/statistics';
import './events/modal';
import './events/forms';

$(document).on('contextmenu', 'input, textarea', (): void =>{
  ipcRenderer.send('show-input-context-menu');
});

ipcRenderer.on('switch-theme', (event: IpcRendererEvent, theme: string): void => {
  switchCss(`${theme}Css`);
  localStorage.setItem('theme', theme);

  const $statisticsItem = $('.js-sidebar-list-element[data-query-type="statistics"]');

  if ($statisticsItem.hasClass('selected')) {
    $statisticsItem.trigger('click');
  }
});

ipcRenderer.on('check-for-updates', async (): Promise<void> => {
  checkForUpdates(true);
});

$(document).on('click', '.js-external-link', (e: Event): void => {
  e.preventDefault();
  const href = $(this).attr('href');
  shell.openExternal(href);
});

if (process.platform === 'darwin') {
  require('./events/macos');
}
