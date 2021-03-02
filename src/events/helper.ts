import $ from 'jquery';

import BookForm from '../elements/bookForm';
import BooksList from '../elements/list/books';
import filterBooks from '../lib/filters/books';
import Statistics from '../elements/statistics';

export const loadBook = async (id: number): Promise<void> => {
  const bookForm = new BookForm(id);
  const rendered = await bookForm.render();
  $('#bookDetails').html(rendered);
  await bookForm.afterRender();

  $(window).trigger('book-form-loaded');
};

export const selectBook = (id: number): void => {
  const $bookList = $('#bookList');
  const $listItem = $(`.js-book-list-element[data-id="${id}"]`);
  const position = $listItem.position();

  if ($listItem && position) {
    $listItem.addClass('selected');

    const bookListTopToolbarHeight = $('#bookListTopToolbar').outerHeight(true);

    $bookList.animate({
      scrollTop: (position.top - bookListTopToolbarHeight) + $bookList.scrollTop(),
    }, 100);
  }
};

export const updateBookList = async (selectedId: number): Promise<void> => {
  const sortBy = localStorage.getItem('sortBy');
  const sortOrder = localStorage.getItem('sortOrder');
  const bookList = new BooksList();

  await bookList.loadBooks(sortBy, sortOrder);
  await refreshBookList();

  if (selectedId) {
    selectBook(selectedId);
  }
};

export const refreshBookList = async (): Promise<void> => {
  const searchTerm = sessionStorage.getItem('searching');
  const isSearching = searchTerm !== 'false';

  if (isSearching) {
    await searchBooks(searchTerm);
  }
  else {
    await changeFilter();
  }
};

export const clearBooklistSelection = (): void => {
  $('.js-book-list-element').removeClass('selected');
  $('#bookForm').removeClass('js-is-visible');
  $('#bookDetails').html('');
  $('#bookFormWrapper').removeClass('form-displayed');
  window.api.send('disable-book-items');
};

export const switchViewNoBooks = (): void => {
  $('#bookListWrapper').addClass('hidden');
  $('#bookFormWrapper').addClass('hidden');
  $('#mainColumnAnchor').removeClass('hidden');
};

export const switchViewWithBooks = (): void => {
  $('#bookListWrapper').removeClass('hidden');
  $('#bookFormWrapper').removeClass('hidden');
  $('#mainColumnAnchor').addClass('hidden');
};

export const changeFilter = async (): Promise<void> => {
  const $element = $('.js-sidebar-list-element.selected');
  const queryType = $element.data('query-type');
  let rendered: string;

  if (queryType === 'statistics') {
    const stats = new Statistics();
    stats.loadStatistics();
    rendered = await stats.render();
    switchViewNoBooks();
    $('#mainColumnAnchor').html(rendered);
  }
  else {
    rendered = await filterBooks(queryType, $element.data('id'));
    switchViewWithBooks();
    $('#bookList').html(rendered);
  }

  sessionStorage.setItem('searching', 'false');
};

export const searchBooks = async (term: string): Promise<void> => {
  $('.js-sidebar-list-element').removeClass('selected');
  const rendered = await filterBooks('search', term);
  switchViewWithBooks();
  $('#bookList').html(rendered);
  sessionStorage.setItem('searching', term);
};

export const switchCss = (id: string): void => {
  $('.js-main-css').prop('disabled', true);
  $(`#${id}`).prop('disabled', false);
};

export const openModal = (id: string): void => {
  const $modalContainer = $('#modalContainer');
  const $modal = $(`#${id}`);

  if (!$modalContainer.hasClass('hidden')) {
    return;
  }

  $modalContainer.removeClass('hidden');
  $modal.removeClass('hidden');

  setTimeout(() => {
    $modalContainer.addClass('open');
    setTimeout(() => {
      $modal.addClass('open');
    }, 100);
  }, 100);

  $(document).on('keydown', function(e: JQuery.TriggeredEvent): void {
    if (e.key === 'Escape') {
      closeModal(id);
    }
  });
};

export const closeModal = (id: string): void => {
  const $modalContainer = $('#modalContainer');
  const $modal = $(`#${id}`);
  $modal.removeClass('open');
  $modalContainer.removeClass('open');

  setTimeout(() => {
    $modal.addClass('hidden');
    $modalContainer.addClass('hidden');
  }, 400);

  $(document).off('keydown');
};
