'use strict';

const {ipcRenderer} = require('electron');
const $ = require('jquery');

const BookForm = require('../elements/bookForm');
const BooksList = require('../elements/list/books');


async function loadBook(id) {
    const bookForm = new BookForm(id);
    const rendered = await bookForm.render();
    $('#bookDetails').html(rendered);
    await bookForm.afterRender();

    $(window).trigger('book-form-loaded'); // eslint-disable-line
}

function selectBook(id) {
    const $bookList = $('#bookList');
    const $listItem = $(`.js-book-list-element[data-id="${id}"]`);
    $listItem.addClass('selected');

    $bookList.animate({
        scrollTop: $listItem.position().top + $bookList.scrollTop()
    }, 100);
}

async function updateBookList(selectedId) {
    const list = new BooksList();
    await list.loadBooks();

    const rendered = await list.render();
    const $bookList = $('#bookList');
    $bookList.html(rendered);

    if (selectedId !== '') selectBook(selectedId);
}

function clearBooklistSelection() {
    $('.js-book-list-element').removeClass('selected');
    $('#bookForm').removeClass('js-is-visible');
    $('#bookDetails').html('');
    $('#bookFormWrapper').removeClass('form-displayed');
    ipcRenderer.send('disable-book-items');
}


module.exports = {
    loadBook,
    selectBook,
    updateBookList,
    clearBooklistSelection
};
