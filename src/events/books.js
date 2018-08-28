'use strict';

const {ipcRenderer, remote} = require('electron');
const dialog = remote.dialog;
const $ = require('jquery');

const config = require('../config/config');

const eventHelper = require('./helper');
const BookListElement = require('../elements/listElement/book');
const BookForm = require('../elements/bookForm');


$(document).on('click', '#bookUtilityMenu', function() { // eslint-disable-line
    ipcRenderer.send('show-book-utility-menu');
});

$(document).on('click', '#bookNotReadYet', function() { // eslint-disable-line
    if ($(this).prop('checked')) $('#bookDateRead').prop('disabled', true);
    else $('#bookDateRead').prop('disabled', false);
});

$(document).on('contextmenu', '.js-book-list-element', function() { // eslint-disable-line
    $(this).trigger('click');
    ipcRenderer.send('show-book-utility-menu');
});

$(window).on('book-form-loaded', function() { // eslint-disable-line
    ipcRenderer.send('enable-book-items');
    $('#bookForm').addClass('js-is-visible');
});



// Create New Book

async function createNewBook() {
    $('.js-book-list-element').removeClass('selected');

    const bookForm = new BookForm();
    const rendered = await bookForm.render();
    $('#bookDetails').html(rendered);
    await bookForm.afterRender();

    $(window).trigger('book-form-loaded'); // eslint-disable-line
}

ipcRenderer.on('create-new-book', createNewBook);
$(document).on('click', '.js-new-book', createNewBook); // eslint-disable-line


// Save Book

let saveTimeout;

async function saveBook() {
    const $bookActivityLoader = $('#bookActivityLoader');
    $bookActivityLoader.removeClass('hidden');

    const formData = {};

    $('#bookForm').find('input[type!="checkbox"]').each(function() {
        const $this = $(this);

        if (!$this.is('.js-book-form-color-form') || ($this.is('.js-book-form-color-form') && $this.hasClass('color-changed')))
            formData[$this.attr('id')] = $this.val();
    });

    $('#bookForm').find('input[type="checkbox"]').each(function() {
        const $this = $(this);
        formData[$this.attr('id')] = $this.prop('checked');
    });

    $('#bookForm').find('textarea').each(function() {
        const $this = $(this);
        formData[$this.attr('id')] = $this.val();
    });

    const id = $('#bookBookcoverId').val();

    const bookForm = new BookForm(id);
    const newId = await bookForm.save(formData);

    if (newId) {
        $('#bookBookcoverId').val(newId);
        await eventHelper.updateBookList(newId);
    }

    setTimeout(() => {
        $bookActivityLoader.addClass('hidden');
    }, 500);
}

async function saveBookTimeout() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveBook, 500);
}

ipcRenderer.on('save-book', saveBook);
$(document).on('change', '.js-book-form-field', saveBookTimeout); // eslint-disable-line
$(document).on('keyup', '.js-book-form-field', saveBookTimeout); // eslint-disable-line


// Load Book

$(document).on('click', '.js-book-list-element', async function() { // eslint-disable-line
    const $this = $(this);
    BookListElement.onClick($this);
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

$(document).on('click', '#bookcoverUploadArea', function() { // eslint-disable-line
    dialog.showOpenDialog(remote.getCurrentWindow(), {
        filters: [
            { name: 'Images', extensions: config.bookcovers.extensions }
        ],
        properties: ['openFile']
    }, async imagePath => saveBookcover(imagePath[0]));
});

$(document).on('dragover', '#bookcoverUploadArea', function(e) { // eslint-disable-line
    e.preventDefault();
    $('#bookcoverUploadArea').addClass('dragover');
});

$(document).on('dragleave', '#bookcoverUploadArea', function(e) { // eslint-disable-line
    e.preventDefault();
    $('#bookcoverUploadArea').removeClass('dragover');
});

$(document).on('drop', '#bookcoverUploadArea', function(e) { // eslint-disable-line
    e.preventDefault();
    $('#bookcoverUploadArea').removeClass('dragover');
    saveBookcover(e.originalEvent.dataTransfer.files[0].path);
});

$(document).on('contextmenu', '#bookcoverUploadArea', function() { // eslint-disable-line
    ipcRenderer.send('show-bookcover-context-menu');
});

ipcRenderer.on('delete-bookcover', deleteBookcover);


// Book Color

$(document).on('click', '.js-book-form-color-stripe', function() { // eslint-disable-line
    $(this).siblings('.js-book-form-color-form').click();
});

$(document).on('change', '.js-book-form-color-form', function() { // eslint-disable-line
    const $colorForm = $(this);
    const color = $colorForm.val();
    $colorForm.siblings('.js-book-form-color-stripe').attr('style', `background-color: ${color}`);
    $colorForm.addClass('color-changed');
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

$(document).on('click', '.js-delete-tag', function() { // eslint-disable-line
    deleteBadge($(this));
});

$(document).on('keypress', '#bookTags', async function(e) { // eslint-disable-line
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

$(document).on('change', '#bookCategories', async function() { // eslint-disable-line
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

$(document).on('mouseout', '.js-rating-star', function() { // eslint-disable-line
    starRestoreTimeout = setTimeout(function() {
        $('.js-rating-star')
            .removeClass('temp-full')
            .removeClass('temp-empty');
    }, 100);
});

$(document).on('mouseover', '.js-rating-star', function() { // eslint-disable-line
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

$(document).on('click', '.js-rating-star', function() { // eslint-disable-line
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

$(document).on('click', '.js-remove-rating', function() { // eslint-disable-line
    $('.js-rating-star')
        .removeClass('full')
        .addClass('empty');

    $('#bookRating').val('').trigger('change');
});
