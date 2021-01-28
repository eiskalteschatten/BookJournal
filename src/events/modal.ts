import { ipcRenderer, remote } from 'electron';
import $ from 'jquery';

import { openModal, closeModal as helperCloseModal } from './helper';

import { changeTheme } from '../lib/preferences/theme';
import changePreferences from '../lib/preferences/change';
import PreferencesModal from '../elements/modal/preferences';
import BooksByAuthor from '../elements/modal/booksByAuthor';

ipcRenderer.on('open-about', (): void => {
  openModal('aboutModal');
});

ipcRenderer.on('open-preferences', async (): Promise<void> => {
  const preferencesModal = new PreferencesModal();
  const rendered = await preferencesModal.render();

  $('#modalAnchor').append(rendered);

  openModal('preferencesModal');
});

function closeModal($modal: JQuery<HTMLElement>): void {
  const id = $modal.attr('id');
  helperCloseModal(id);

  if (id === 'preferencesModal') {
    setTimeout(() => {
      $modal.remove();
    }, 200);
  }
}

$(document).on('click', '.js-modal-close', (): void => {
  const $modal = $('.js-modal.open');
  closeModal($modal);
});

$(document).on('click', '#modalContainer', (event: JQuery.TriggeredEvent): void => {
  if (!$('#modalAnchor').has(event.target).length) {
    const $modal = $(this).find('.js-modal:not(.hidden)');
    closeModal($modal);
  }
});


// Preferences Modal

$(document).on('click', '.js-preferences-theme', (): void => {
  const theme = $(this).data('theme');
  changeTheme(theme, remote.getCurrentWindow());
});

$(document).on('click', '#preferencesFetchBookInformation', (): void => {
  changePreferences({
    fetchBookInfoFromGoogle: $(this).prop('checked'),
  });
});

$(document).on('click', '#preferencesFetchBooksByAuthor', (): void => {
  changePreferences({
    fetchBooksByAuthor: $(this).prop('checked'),
  });
});

$(document).on('change', '#preferencesFetchBooksByAuthorLanguage', (): void => {
  changePreferences({
    fetchBooksByAuthorLanguage: $(this).val().toString(),
  });
});

$(document).on('click', '#preferencesCheckForUpdates', (): void => {
  changePreferences({
    checkForUpdates: $(this).prop('checked'),
  });
});


// Books By Author modal

$(document).on('click', '#booksByAuthorShowMoreResults', async (): Promise<void> => {
  const $loader = $('#booksByAuthorShowMoreResultsLoader');
  $loader.removeClass('invisible');

  const authors = $('#bookAuthor').val().toString();
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

  const indexFactorString = sessionStorage.getItem('booksByAuthorIndexFactor');
  const indexFactor = parseInt(indexFactorString) + 1;
  await booksByAuthor.fetchBooks(indexFactor);

  if (!booksByAuthor.hasMoreResults()) {
    hideMoreResults();
  }
});
