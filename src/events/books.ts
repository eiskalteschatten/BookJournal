import { ipcRenderer, remote } from 'electron';
import $ from 'jquery';
import request from 'request';
import fs from 'fs';
import path from 'path';
import allLanguages from 'iso-639-1';
import moment from 'moment';

import config from '../config';

import { refreshBookList, updateBookList, loadBook, clearBooklistSelection, openModal } from './helper';
import BookForm from '../elements/bookForm';
import BooksByAuthor from '../elements/modal/booksByAuthor';
import Preferences from '../models/preferences';

const { dialog } = remote;

$(document).on('click', '#bookUtilityMenu', (): void => {
  ipcRenderer.send('show-book-utility-menu');
});

$(document).on('contextmenu', '.js-book-list-element', (): void => {
  $(this).trigger('click');
  ipcRenderer.send('show-book-utility-menu');
});

$(window).on('book-form-loaded', (): void => {
  ipcRenderer.send('enable-book-items');
  $('#bookForm').addClass('js-is-visible');
});

$(document).on('change', '#bookSort', (): void => {
  const sortBy = $(this).val().toString();
  localStorage.setItem('sortBy', sortBy);
  refreshBookList();
});

$(document).on('click', '#bookSortOrder', (e: JQuery.TriggeredEvent): void => {
  e.preventDefault();

  const oldSortOrder = localStorage.getItem('sortOrder') || 'ASC';
  const sortOrder = oldSortOrder === 'ASC' ? 'DESC' : 'ASC';
  const newArrow = sortOrder === 'DESC' ? '&darr;' : '&uarr;';

  localStorage.setItem('sortOrder', sortOrder);
  $(this).html(newArrow);
  refreshBookList();
});


// Create New Book

async function createNewBook(): Promise<void> {
  $('.js-book-list-element').removeClass('selected');

  const bookForm = new BookForm();
  const rendered = await bookForm.render();
  $('#bookDetails').html(rendered);
  await bookForm.afterRender();

  $(window).trigger('book-form-loaded');
}

ipcRenderer.on('create-new-book', createNewBook);
$(document).on('click', '.js-new-book', createNewBook);


// Save Book

let saveTimeout: NodeJS.Timeout;

async function saveBook(): Promise<void> {
  const $bookActivityLoader = $('#bookActivityLoader');
  $bookActivityLoader.removeClass('hidden');

  // TODO: add interface from BookForm (create first)
  const formData = {} as any;

  $('#bookForm').find('input[type!="checkbox"]').each((): void => {
    const $this = $(this);

    if (!$this.is('.js-book-form-color-form') || ($this.is('.js-book-form-color-form') && $this.data('color-changed'))) {
      let value = $this.val().toString();

      if ($this.is('#bookIsbn')) {
        value = value.replace(/[^0-9]/g, '');
        $this.val(value);
      }

      if ($this.is('.js-book-form-date-field')) {
        const date = moment(value, 'L', window.navigator.languages[0]);
        value = date.isValid() ? date.format('YYYY-MM-DD') : '';
      }

      formData[$this.attr('id')] = value;
      if ($this.data('color-changed')) {
        $this.data('color-changed', false);
      }
    }
  });

  $('#bookForm').find('input[type="checkbox"]').each((): void => {
    const $this = $(this);
    formData[$this.attr('id')] = $this.prop('checked');
  });

  $('#bookForm').find('textarea').each((): void => {
    const $this = $(this);
    formData[$this.attr('id')] = $this.val();
  });

  formData.bookBookFormat = $('#bookForm').find('#bookBookFormat').val().toString();

  const id = Number($('#bookBookcoverId').val());
  const bookForm = new BookForm(id);
  const newId = await bookForm.save(formData);

  if (newId) {
    $('#bookBookcoverId').val(newId);
    await updateBookList(newId);
  }

  const authors = $('#bookAuthor').val().toString();
  const booksByAuthor = new BooksByAuthor(authors);
  await booksByAuthor.fetchBooks();

  setTimeout((): void => {
    $bookActivityLoader.addClass('hidden');
  }, 500);
}

async function saveBookTimeout(): Promise<void> {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(saveBook, 500);
}

ipcRenderer.on('save-book', saveBook);
$(document).on('change', '.js-book-form-field', saveBookTimeout);
$(document).on('keyup', '.js-book-form-field', saveBookTimeout);


// Load Book

$(document).on('click', '.js-book-list-element', async (): Promise<void> => {
  const $this = $(this);
  $('.js-book-list-element').removeClass('selected');
  $(this).addClass('selected');
  await loadBook($this.data('id'));
});


// Delete Book

async function deleteBook() {
  const $selectedBook = $('.js-book-list-element.selected');
  const id = $selectedBook.data('id');

  const bookForm = new BookForm(id);
  await bookForm.delete();

  $(`.js-book-list-element[data-id="${id}"]`).remove();
  clearBooklistSelection();
}

ipcRenderer.on('delete-book', deleteBook);


// Bookcover

async function saveBookcover(imagePath: string): Promise<void> {
  const fileInfo = await BookForm.saveBookcover(imagePath);
  if (fileInfo.fileName) {
    $('#bookBookcoverFileName').val(fileInfo.fileName).trigger('change');
  }

  $('#bookcoverImage').attr('style', `background-image: url('${fileInfo.filePath}')`);
  $('#bookcoverUploadArea').addClass('has-bookcover');
}

async function deleteBookcover(): Promise<void> {
  if ($('#bookcoverUploadArea').hasClass('has-bookcover')) {
    const $bookcoverFileName = $('#bookBookcoverFileName');
    const fileName = $bookcoverFileName.val().toString();

    await BookForm.deleteBookcover(fileName);

    $bookcoverFileName .val('').trigger('change');
    $('#bookcoverImage').attr('style', '');
    $('#bookcoverUploadArea').removeClass('has-bookcover');
  }
}

$(document).on('click', '#bookcoverUploadArea', async (): Promise<void> => {
  const result = await dialog.showOpenDialog(remote.getCurrentWindow(), {
    filters: [
      { name: 'Images', extensions: config.bookcovers.extensions },
    ],
    properties: ['openFile'],
  });

  await saveBookcover(result.filePaths[0]);
});

$(document).on('dragover', '#bookcoverUploadArea', (e: JQuery.TriggeredEvent): void => {
  e.preventDefault();
  $('#bookcoverUploadArea').addClass('dragover');
});

$(document).on('dragleave', '#bookcoverUploadArea', (e: JQuery.TriggeredEvent): void => {
  e.preventDefault();
  $('#bookcoverUploadArea').removeClass('dragover');
});

$(document).on('drop', '#bookcoverUploadArea', (e: JQuery.DropEvent): void => {
  e.preventDefault();
  $('#bookcoverUploadArea').removeClass('dragover');
  saveBookcover(e.originalEvent.dataTransfer.files[0].path);
});

$(document).on('contextmenu', '#bookcoverUploadArea', (): void => {
  ipcRenderer.send('show-bookcover-context-menu');
});

ipcRenderer.on('delete-bookcover', deleteBookcover);

ipcRenderer.on('get-bookcover-color', async (): Promise<void> => {
  const fileName = $('#bookBookcoverFileName').val().toString();
  const bookcoverPath = config.bookcovers.path;
  const filePath = path.resolve(bookcoverPath, fileName);
  const color = await BookForm.getPrimaryBookcoverColor(filePath);

  $('#bookColor').val(color).trigger('change');
});


// Book Color

$(document).on('click', '.js-book-form-color-stripe', (): void => {
  $(this).siblings('.js-book-form-color-form').trigger('click');
});

$(document).on('change', '.js-book-form-color-form', (): void => {
  const $colorForm = $(this);
  const color = $colorForm.val();
  $colorForm.siblings('.js-book-form-color-stripe').attr('style', `background-color: ${color}`);
  $colorForm.data('color-changed', true);
});


// Tags & Categories

function deleteBadge($deleteButton: JQuery<HTMLElement>): void {
  const $badge = $deleteButton.closest('.js-tag-badge');
  const $tagCluster = $deleteButton.closest('.js-tag-cluster');
  const $tagHidden = $tagCluster.siblings('.js-tag-hidden');
  const tagText = $badge.data('delete-id');
  const tags = $tagHidden.val().toString().split(',');
  const newTags = tags.filter((tag: string): boolean => tag + '' !== tagText + '');

  if ($tagCluster.hasClass('js-category-cluster')) {
    $tagCluster
      .siblings('.js-pre-tag-cluster-wrapper')
      .find('#bookCategories')
      .find(`option[value="${tagText}"]`)
      .prop('disabled', false);
  }

  $tagHidden.val(newTags).trigger('change');
  $badge.remove();
}

$(document).on('click', '.js-delete-tag', (): void => {
  deleteBadge($(this));
});

$(document).on('keypress', '#bookTags', async (e: JQuery.TriggeredEvent): Promise<void> => {
  if (e.key !== 'Enter') {
    return;
  }
  e.preventDefault();

  const $this = $(this);
  const $wrapper = $this.closest('.js-pre-tag-cluster-wrapper');
  const inputValue = $this.val().toString().trim();

  if (inputValue !== '') {
    const $tagHidden = $wrapper.siblings('.js-tag-hidden');
    const $tagCluster = $wrapper.siblings('.js-tag-cluster');
    const newTags = inputValue.split(',');

    for (const i in newTags) {
      const tag = newTags[i].trim();
      if (tag !== '') {
        const badge = await BookForm.renderTagCategoryBadge(tag, tag, 'tag');
        $tagCluster.append(badge);

        const hiddenValue = $tagHidden.val();
        const newValue = hiddenValue !== '' ? hiddenValue + ',' + tag : tag;
        $tagHidden.val(newValue);
      }
    }

    $tagHidden.trigger('change');
    $tagCluster.removeClass('hidden');
    $this.val('');
  }
});

$(document).on('change', '#bookCategories', async (): Promise<void> => {
  const $this = $(this);
  const $wrapper = $this.closest('.js-pre-tag-cluster-wrapper');
  const $selected = $this.find('option:selected');
  const $tagHidden = $wrapper.siblings('.js-tag-hidden');
  const $tagCluster = $wrapper.siblings('.js-tag-cluster');
  const categoryId = $this.val().toString();
  const color = $selected.data('color');

  const badge = await BookForm.renderTagCategoryBadge($selected.text(), categoryId, 'category', color);
  $tagCluster.append(badge);

  const hiddenValue = $tagHidden.val();
  const newValue = hiddenValue !== '' ? hiddenValue + ',' + categoryId : categoryId;
  $tagHidden.val(newValue).trigger('change');

  $tagCluster.removeClass('hidden');
  $selected.prop('disabled', true);
  $this.val('-1');
});


// Rating Stars

let starRestoreTimeout: NodeJS.Timeout;

$(document).on('mouseout', '.js-rating-star', (): void => {
  starRestoreTimeout = setTimeout((): void => {
    $('.js-rating-star')
      .removeClass('temp-full')
      .removeClass('temp-empty');
  }, 100);
});

$(document).on('mouseover', '.js-rating-star', (): void => {
  clearTimeout(starRestoreTimeout);

  $('.js-rating-star')
    .removeClass('temp-full')
    .addClass('temp-empty');

  $(this).prevAll()
    .removeClass('temp-empty')
    .addClass('temp-full');

  $(this)
    .removeClass('temp-empty')
    .addClass('temp-full');
});

$(document).on('click', '.js-rating-star', (): void => {
  clearTimeout(starRestoreTimeout);

  const values = [];

  $('.js-rating-star').each((): void => {
    const $this = $(this);

    $this
      .removeClass('full')
      .removeClass('empty');

    if ($this.hasClass('temp-full')) {
      $(this).removeClass('temp-full').addClass('full');
      values.push(parseInt($this.data('value')));
    }
    else if ($this.hasClass('temp-empty')) {
      $(this).removeClass('temp-empty').addClass('empty');
    }
  });

  const rating = Math.max(...values);
  $('#bookRating').val(rating).trigger('change');
});

$(document).on('click', '.js-remove-rating', (): void => {
  $('.js-rating-star')
    .removeClass('full')
    .addClass('empty');

  $('#bookRating').val('').trigger('change');
});


// Fetching Book Information

let fetchingTimeout: NodeJS.Timeout;

$(document).on('blur', '#bookIsbn', (): void => {
  try {
    const preferencesString = localStorage.getItem('preferences');
    const preferences: Preferences = JSON.parse(preferencesString);

    if (!preferences.fetchBookInfoFromGoogle) {
      return;
    }

    clearTimeout(fetchingTimeout);

    const isbn = $(this).val().toString().replace(/[^0-9]/g, '');
    if (!isbn) {
      return;
    }

    fetchingTimeout = setTimeout(async (): Promise<void> => {
      $('#bookBookInfoFetched').addClass('hidden');
      $('#bookFetchingBookInfo').removeClass('hidden');

      const bookInfo = await BookForm.fetchBookInfo(isbn);
      sessionStorage.setItem('bookInfo', JSON.stringify(bookInfo));

      $('#bookFetchingBookInfo').addClass('hidden');

      if (typeof bookInfo === 'object' && bookInfo.totalItems > 0) {
        $('#bookBookInfoFetched').removeClass('hidden');
      }
    }, 500);
  }
  catch (error) {
    console.error(error);
  }
});

$(document).on('click', '#bookFillOutBookInfo', async (e: JQuery.TriggeredEvent): Promise<void> => {
  e.preventDefault();

  try {
    const bookInfoString = sessionStorage.getItem('bookInfo');
    let bookInfo = JSON.parse(bookInfoString);
    bookInfo = bookInfo.items[0].volumeInfo;

    const authors = bookInfo.authors.join(', ');
    const publishedDate = new Date(bookInfo.publishedDate);
    const language = allLanguages.getName(bookInfo.language);

    $('#bookTitle').val(bookInfo.title);
    $('#bookAuthor').val(authors);
    $('#bookPublisher').val(bookInfo.publisher);
    $('#bookYearPublished').val(publishedDate.getFullYear());
    $('#bookSummary').val(bookInfo.description);
    $('#bookNumberOfPages').val(bookInfo.pageCount);
    $('#bookLanguageReadIn').val(language);

    await saveBook();

    if (bookInfo.imageLinks && (bookInfo.imageLinks.thumbnail || bookInfo.imageLinks.small || bookInfo.imageLinks.medium || bookInfo.imageLinks.large)) {
      let imagePath = config.bookcovers.tempPath;
      fs.mkdir(imagePath, { recursive: true }, (error: Error): void => {
        if (error) {
          console.error(error);
        }

        imagePath = path.join(imagePath, 'tempCover.jpg');

        const bookCoverLink = bookInfo.imageLinks.large
          ? bookInfo.imageLinks.large
          : bookInfo.imageLinks.medium
            ? bookInfo.imageLinks.medium
            : bookInfo.imageLinks.small
              ? bookInfo.imageLinks.small
              : bookInfo.imageLinks.thumbnail;

        request({ uri: bookCoverLink })
          .pipe(fs.createWriteStream(imagePath))
          .on('close', async () => {
            await saveBookcover(imagePath);
          });
      });
    }
  }
  catch (error) {
    console.error(error);
  }
});


// Books by Authors

$(document).on('click', '#bookBooksByAuthorLink', async (e: JQuery.TriggeredEvent): Promise<void> => {
  e.preventDefault();

  if ($('#booksByAuthorModal').length) {
    $('#booksByAuthorModal').remove();
  }

  const authors = $('#bookAuthor').val().toString();
  const booksByAuthor = new BooksByAuthor(authors);
  const rendered = await booksByAuthor.render();

  $('#modalAnchor').append(rendered);

  openModal('booksByAuthorModal');
});
