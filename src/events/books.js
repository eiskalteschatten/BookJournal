'use strict';

const {ipcRenderer} = require('electron');
const $ = require('jquery');

const BookListElement = require('../elements/listElement/book');
const BookForm = require('../elements/bookForm');


let $elementWithContextMenu; // eslint-disable-line

$(document).on('contextmenu', '.js-book-list-element', function() { // eslint-disable-line
    $elementWithContextMenu = $(this);
    ipcRenderer.send('show-book-utility-menu');
});


// Load book

async function loadBook(id) {
    const bookForm = new BookForm(id);
    const rendered = await bookForm.render();
    $('#bookDetails').html(rendered);
    await bookForm.afterRender();

    $(window).trigger('book-form-loaded'); // eslint-disable-line
}

$(document).on('click', '.js-book-list-element', async function() { // eslint-disable-line
    const $this = $(this);
    BookListElement.onClick($this);
    await loadBook($this.data('id'));
});
