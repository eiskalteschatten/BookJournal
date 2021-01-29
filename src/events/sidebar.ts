import $ from 'jquery';

import { changeFilter, clearBooklistSelection, searchBooks } from './helper';

$(document).on('click', '.js-sidebar-list-element', async function(): Promise<void> {
  $('.js-sidebar-list-element').removeClass('selected');
  $(this).addClass('selected');
  await changeFilter();
  clearBooklistSelection();
});


let searchTimeout: NodeJS.Timeout;

$(document).on('keypress', '#sidebarSearchField', async function(): Promise<void> {
  clearTimeout(searchTimeout);
  const term = $(this).val().toString();

  searchTimeout = setTimeout(async (): Promise<void> => {
    await searchBooks(term);
    clearBooklistSelection();
  }, 100);
});
