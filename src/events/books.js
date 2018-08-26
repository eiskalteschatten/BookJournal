'use strict';

const {ipcRenderer} = require('electron');
const $ = require('jquery');

const BookListElement = require('../elements/listElement/book');


let $elementWithContextMenu; // eslint-disable-line

$(document).on('contextmenu', '.js-book-list-element', function() { // eslint-disable-line
    $elementWithContextMenu = $(this);
    ipcRenderer.send('show-book-utility-menu');
});

$(document).on('click', '.js-book-list-element', function() { // eslint-disable-line
    BookListElement.onClick($(this));
});
