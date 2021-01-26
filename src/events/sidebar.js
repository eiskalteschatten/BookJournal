'use strict';

const $ = require('jquery');

const eventHelper = require('./helper');


$(document).on('click', '.js-sidebar-list-element', async function() {
  $('.js-sidebar-list-element').removeClass('selected');
  $(this).addClass('selected');
  await eventHelper.changeFilter();
  eventHelper.clearBooklistSelection();
});


let searchTimeout;

$(document).on('keypress', '#sidebarSearchField', async function() {
  clearTimeout(searchTimeout);
  const term = $(this).val();

  searchTimeout = setTimeout(async () => {
    await eventHelper.searchBooks(term);
    eventHelper.clearBooklistSelection();
  }, 100);
});
