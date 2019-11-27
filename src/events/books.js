'use strict';

const {ipcRenderer, remote} = require('electron');
const dialog = remote.dialog;
const $ = require('jquery');
const request = require('request');
const fs = require('fs');
const path = require('path');
const allLanguages = require('iso-639-1');
const moment = require('moment');

const config = require('../config/config');

const eventHelper = require('./helper');
const BookForm = require('../elements/bookForm');
const BooksByAuthor = require('../elements/modal/booksByAuthor');


$(document).on('click', '#bookUtilityMenu', function() {
    ipcRenderer.send('show-book-utility-menu');
});

$(document).on('contextmenu', '.js-book-list-element', function() {
    $(this).trigger('click');
    ipcRenderer.send('show-book-utility-menu');
});

$(window).on('book-form-loaded', function() {
    ipcRenderer.send('enable-book-items');
    $('#bookForm').addClass('js-is-visible');
});

$(document).on('change', '#bookSort', function() {
    const sortBy = $(this).val();
    localStorage.setItem('sortBy', sortBy);
    eventHelper.refreshBookList();
});

$(document).on('click', '#bookSortOrder', function(e) {
    e.preventDefault();

    const oldSortOrder = localStorage.getItem('sortOrder') || 'ASC';
    const sortOrder = oldSortOrder === 'ASC' ? 'DESC' : 'ASC';
    const newArrow = sortOrder === 'DESC' ? '&darr;' : '&uarr;';

    localStorage.setItem('sortOrder', sortOrder);
    $(this).html(newArrow);
    eventHelper.refreshBookList();
});


// Create New Book

async function createNewBook() {
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

let saveTimeout;

async function saveBook() {
    const $bookActivityLoader = $('#bookActivityLoader');
    $bookActivityLoader.removeClass('hidden');

    const formData = {};

    $('#bookForm').find('input[type!="checkbox"]').each(function() {
        const $this = $(this);

        if (!$this.is('.js-book-form-color-form') || ($this.is('.js-book-form-color-form') && $this.data('color-changed'))) {
            let value = $this.val();

            if ($this.is('#bookIsbn')) {
                value = value.replace(/[^0-9]/g, '');
                $this.val(value);
            }

            if ($this.is('.js-book-form-date-field')) {
                const date = moment(value, 'L', window.navigator.languages);
                value = date.isValid() ? date.format('YYYY-MM-DD') : '';
            }

            formData[$this.attr('id')] = value;
            if ($this.data('color-changed')) $this.data('color-changed', false);
        }
    });

    $('#bookForm').find('input[type="checkbox"]').each(function() {
        const $this = $(this);
        formData[$this.attr('id')] = $this.prop('checked');
    });

    $('#bookForm').find('textarea').each(function() {
        const $this = $(this);
        formData[$this.attr('id')] = $this.val();
    });

    formData.bookBookFormat = $('#bookForm').find('#bookBookFormat').val();

    const id = $('#bookBookcoverId').val();
    const bookForm = new BookForm(id);
    const newId = await bookForm.save(formData);

    if (newId) {
        $('#bookBookcoverId').val(newId);
        await eventHelper.updateBookList(newId);
    }

    const authors = $('#bookAuthor').val();
    const booksByAuthor = new BooksByAuthor(authors);
    booksByAuthor.fetchBooks();

    setTimeout(() => {
        $bookActivityLoader.addClass('hidden');
    }, 500);
}

async function saveBookTimeout() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveBook, 500);
}

ipcRenderer.on('save-book', saveBook);
$(document).on('change', '.js-book-form-field', saveBookTimeout);
$(document).on('keyup', '.js-book-form-field', saveBookTimeout);


// Load Book

$(document).on('click', '.js-book-list-element', async function() {
    const $this = $(this);
    $('.js-book-list-element').removeClass('selected');
    $(this).addClass('selected');
    await eventHelper.loadBook($this.data('id'));
});


// Delete Book

async function deleteBook() {
    const $selectedBook = $('.js-book-list-element.selected');
    const id = $selectedBook.data('id');

    const bookForm = new BookForm(id);
    await bookForm.delete();

    $(`.js-book-list-element[data-id="${id}"]`).remove();
    eventHelper.clearBooklistSelection();
}

ipcRenderer.on('delete-book', deleteBook);


// Bookcover

async function saveBookcover(imagePath) {
    const fileInfo = await BookForm.saveBookcover(imagePath);
    if (fileInfo.fileName) $('#bookBookcoverFileName').val(fileInfo.fileName).trigger('change');

    $('#bookcoverImage').attr('style', `background-image: url('${fileInfo.filePath}')`);
    $('#bookcoverUploadArea').addClass('has-bookcover');
}

async function deleteBookcover() {
    if ($('#bookcoverUploadArea').hasClass('has-bookcover')) {
        const $bookcoverFileName = $('#bookBookcoverFileName');
        const fileName = $bookcoverFileName.val();

        await BookForm.deleteBookcover(fileName);

        $bookcoverFileName .val('').trigger('change');
        $('#bookcoverImage').attr('style', '');
        $('#bookcoverUploadArea').removeClass('has-bookcover');
    }
}

$(document).on('click', '#bookcoverUploadArea', async function() {
    const result = await dialog.showOpenDialog(remote.getCurrentWindow(), {
        filters: [
            { name: 'Images', extensions: config.bookcovers.extensions }
        ],
        properties: ['openFile']
    });

    await saveBookcover(result.filePaths[0]);
});

$(document).on('dragover', '#bookcoverUploadArea', function(e) {
    e.preventDefault();
    $('#bookcoverUploadArea').addClass('dragover');
});

$(document).on('dragleave', '#bookcoverUploadArea', function(e) {
    e.preventDefault();
    $('#bookcoverUploadArea').removeClass('dragover');
});

$(document).on('drop', '#bookcoverUploadArea', function(e) {
    e.preventDefault();
    $('#bookcoverUploadArea').removeClass('dragover');
    saveBookcover(e.originalEvent.dataTransfer.files[0].path);
});

$(document).on('contextmenu', '#bookcoverUploadArea', function() {
    ipcRenderer.send('show-bookcover-context-menu');
});

ipcRenderer.on('delete-bookcover', deleteBookcover);

ipcRenderer.on('get-bookcover-color', async function() {
    const fileName = $('#bookBookcoverFileName').val();
    const bookcoverPath = config.bookcovers.path;
    const filePath = path.resolve(bookcoverPath, fileName);
    const color = await BookForm.getPrimaryBookcoverColor(filePath);

    $('#bookColor').val(color).trigger('change');
});


// Book Color

$(document).on('click', '.js-book-form-color-stripe', function() {
    $(this).siblings('.js-book-form-color-form').click();
});

$(document).on('change', '.js-book-form-color-form', function() {
    const $colorForm = $(this);
    const color = $colorForm.val();
    $colorForm.siblings('.js-book-form-color-stripe').attr('style', `background-color: ${color}`);
    $colorForm.data('color-changed', true);
});


// Tags & Categories

function deleteBadge($deleteButton) {
    const $badge = $deleteButton.closest('.js-tag-badge');
    const $tagCluster = $deleteButton.closest('.js-tag-cluster');
    const $tagHidden = $tagCluster.siblings('.js-tag-hidden');
    const tagText = $badge.data('delete-id');
    const tags = $tagHidden.val().split(',');

    const newTags = tags.filter(tag => {
        return tag + '' !== tagText + '';
    });

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

$(document).on('click', '.js-delete-tag', function() {
    deleteBadge($(this));
});

$(document).on('keypress', '#bookTags', async function(e) {
    if (e.keyCode !== 13) return;
    e.preventDefault();

    const $this = $(this);
    const $wrapper = $this.closest('.js-pre-tag-cluster-wrapper');
    const inputValue = $this.val().trim();

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

$(document).on('change', '#bookCategories', async function() {
    const $this = $(this);
    const $wrapper = $this.closest('.js-pre-tag-cluster-wrapper');
    const $selected = $this.find('option:selected');
    const $tagHidden = $wrapper.siblings('.js-tag-hidden');
    const $tagCluster = $wrapper.siblings('.js-tag-cluster');
    const categoryId = $this.val();
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

let starRestoreTimeout;

$(document).on('mouseout', '.js-rating-star', function() {
    starRestoreTimeout = setTimeout(function() {
        $('.js-rating-star')
            .removeClass('temp-full')
            .removeClass('temp-empty');
    }, 100);
});

$(document).on('mouseover', '.js-rating-star', function() {
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

$(document).on('click', '.js-rating-star', function() {
    clearTimeout(starRestoreTimeout);

    const values = [];

    $('.js-rating-star').each(function() {
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

$(document).on('click', '.js-remove-rating', function() {
    $('.js-rating-star')
        .removeClass('full')
        .addClass('empty');

    $('#bookRating').val('').trigger('change');
});


// Fetching Book Information

let fetchingTimeout;

$(document).on('blur', '#bookIsbn', function() {
    try {
        let preferences = localStorage.getItem('preferences');
        preferences = JSON.parse(preferences);

        if (!preferences.fetchBookInfoFromGoogle) return;

        clearTimeout(fetchingTimeout);

        const isbn = $(this).val().replace(/[^0-9]/g, '');
        if (!isbn) return;

        fetchingTimeout = setTimeout(async () => {
            $('#bookBookInfoFetched').addClass('hidden');
            $('#bookFetchingBookInfo').removeClass('hidden');

            const bookInfo = await BookForm.fetchBookInfo(isbn);
            sessionStorage.setItem('bookInfo', JSON.stringify(bookInfo));

            $('#bookFetchingBookInfo').addClass('hidden');

            if (typeof bookInfo === 'object' && bookInfo.totalItems > 0)
                $('#bookBookInfoFetched').removeClass('hidden');
        }, 500);
    }
    catch(error) {
        console.error(error);
    }
});

$(document).on('click', '#bookFillOutBookInfo', async function(e) {
    e.preventDefault();

    try {
        let bookInfo = sessionStorage.getItem('bookInfo');
        bookInfo = JSON.parse(bookInfo);
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

        if (bookInfo.imageLinks && bookInfo.imageLinks.thumbnail) {
            let imagePath = config.bookcovers.tempPath;
            fs.mkdir(imagePath, { recursive: true }, error => {
                if (error) {
                    console.error(error);
                }

                imagePath = path.join(imagePath, 'tempCover.jpg');

                request({uri: bookInfo.imageLinks.thumbnail})
                    .pipe(fs.createWriteStream(imagePath))
                    .on('close', async () => {
                        await saveBookcover(imagePath);
                    });
            });
        }
    }
    catch(error) {
        console.error(error);
    }
});


// Books by Authors

$(document).on('click', '#bookBooksByAuthorLink', async function(e) {
    e.preventDefault();

    if ($('#booksByAuthorModal').length) $('#booksByAuthorModal').remove();

    const authors = $('#bookAuthor').val();
    const booksByAuthor = new BooksByAuthor(authors);
    const rendered = await booksByAuthor.render();

    $('#modalAnchor').append(rendered);

    eventHelper.openModal('booksByAuthorModal');
});
