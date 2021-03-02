import { IpcRendererEvent } from 'electron';
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

$(document).on('contextmenu', 'input, textarea', function(): void {
  window.api.send('show-input-context-menu');
});

window.api.on('switch-theme', function(event: IpcRendererEvent, theme: string): void {
  switchCss(`${theme}Css`);
  localStorage.setItem('theme', theme);

  const $statisticsItem = $('.js-sidebar-list-element[data-query-type="statistics"]');

  if ($statisticsItem.hasClass('selected')) {
    $statisticsItem.trigger('click');
  }
});

window.api.on('check-for-updates', async function(): Promise<void> {
  checkForUpdates(true);
});

$(document).on('click', '.js-external-link', function(e: JQuery.TriggeredEvent): void {
  e.preventDefault();
  const href = $(this).attr('href');
  window.shell.openExternal(href);
});

if (process.platform === 'darwin') {
  require('./events/macos');
}
