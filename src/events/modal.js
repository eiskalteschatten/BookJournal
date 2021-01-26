'use strict';

const { ipcRenderer, remote } = require('electron');
const $ = require('jquery');

const helper = require('./helper');

const preferencesTheme = require('../lib/preferences/theme');
const changePreferences = require('../lib/preferences/change');
const PreferencesModal = require('../elements/modal/preferences');
const BooksByAuthor = require('../elements/modal/booksByAuthor');


ipcRenderer.on('open-about', () => {
  helper.openModal('aboutModal');
});

ipcRenderer.on('open-preferences', async () => {
  const preferencesModal = new PreferencesModal();
  const rendered = await preferencesModal.render();

  $('#modalAnchor').append(rendered);

  helper.openModal('preferencesModal');
});

function closeModal($modal) {
  const id = $modal.attr('id');
  helper.closeModal(id);

  if (id === 'preferencesModal') {
    setTimeout(() => {
      $modal.remove();
    }, 200);
  }
}

$(document).on('click', '.js-modal-close', function() {
  const $modal = $(this).closest('.js-modal');
  closeModal($modal);
});

$(document).on('click', '#modalContainer', function(e) {
  if (!$('#modalAnchor').has(e.target).length) {
    const $modal = $(this).find('.js-modal:not(.hidden)');
    closeModal($modal);
  }
});


// Preferences Modal

$(document).on('click', '.js-preferences-theme', function() {
  const theme = $(this).data('theme');
  preferencesTheme.changeTheme(theme, remote.getCurrentWindow());
});

$(document).on('click', '#preferencesFetchBookInformation', function() {
  changePreferences({
    fetchBookInfoFromGoogle: $(this).prop('checked'),
  });
});

$(document).on('click', '#preferencesFetchBooksByAuthor', function() {
  changePreferences({
    fetchBooksByAuthor: $(this).prop('checked'),
  });
});

$(document).on('change', '#preferencesFetchBooksByAuthorLanguage', function() {
  changePreferences({
    fetchBooksByAuthorLanguage: $(this).val(),
  });
});

$(document).on('click', '#preferencesCheckForUpdates', function() {
  changePreferences({
    checkForUpdates: $(this).prop('checked'),
  });
});


// Books By Author modal

$(document).on('click', '#booksByAuthorShowMoreResults', async function() {
  const $loader = $('#booksByAuthorShowMoreResultsLoader');
  $loader.removeClass('invisible');

  const authors = $('#bookAuthor').val();
  const booksByAuthor = new BooksByAuthor(authors);

  const hideMoreResults = () => {
    $('#booksByAuthorShowMoreResultsWrapper').remove();
  };

  try {
    const books = sessionStorage.getItem('booksByAuthor');
    const booksJson = JSON.parse(books);
    const sortedBooks = booksByAuthor.sortBooksByTitle(booksJson);

    if (sortedBooks.length === 0) {
      hideMoreResults();
    }
    else {
      const rendered = await booksByAuthor.renderBookList(sortedBooks);
      $('#booksByAuthorBookListAnchor').append(rendered);
    }

    $loader.addClass('invisible');
  }
  catch (error) {
    console.error(error);
  }

  let indexFactor = sessionStorage.getItem('booksByAuthorIndexFactor');
  indexFactor = parseInt(indexFactor) + 1;
  await booksByAuthor.fetchBooks(indexFactor);

  if (!booksByAuthor.hasMoreResults()) hideMoreResults();
});
