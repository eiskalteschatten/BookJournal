import $ from 'jquery';

import eventHelper from './helper';

$(document).on('click', '.js-sidebar-list-element', async (): Promise<void> => {
  $('.js-sidebar-list-element').removeClass('selected');
  $(this).addClass('selected');
  await eventHelper.changeFilter();
  eventHelper.clearBooklistSelection();
});


let searchTimeout: NodeJS.Timeout;

$(document).on('keypress', '#sidebarSearchField', async (): Promise<void> => {
  clearTimeout(searchTimeout);
  const term = $(this).val();

  searchTimeout = setTimeout(async (): Promise<void> => {
    await eventHelper.searchBooks(term);
    eventHelper.clearBooklistSelection();
  }, 100);
});
