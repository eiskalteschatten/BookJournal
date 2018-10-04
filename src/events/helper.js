'use strict';

const {ipcRenderer} = require('electron');
const $ = require('jquery');

const BookForm = require('../elements/bookForm');
const BooksList = require('../elements/list/books');
const filterBooks = require('../lib/filters/books');
const Statistics = require('../elements/statistics');


async function loadBook(id) {
    const bookForm = new BookForm(id);
    const rendered = await bookForm.render();
    $('#bookDetails').html(rendered);
    await bookForm.afterRender();

    $(window).trigger('book-form-loaded');
}

function selectBook(id) {
    const $bookList = $('#bookList');
    const $listItem = $(`.js-book-list-element[data-id="${id}"]`);
    const position = $listItem.position();

    if ($listItem && position) {
        $listItem.addClass('selected');

        const bookListTopToolbarHeight = $('#bookListTopToolbar').outerHeight(true);

        $bookList.animate({
            scrollTop: (position.top - bookListTopToolbarHeight) + $bookList.scrollTop()
        }, 100);
    }
}

async function updateBookList(selectedId) {
    const sortBy = localStorage.getItem('sortBy');
    const sortOrder = localStorage.getItem('sortOrder');
    const bookList = new BooksList();

    await bookList.loadBooks(sortBy, sortOrder);
    await refreshBookList();

    if (selectedId !== '') selectBook(selectedId);
}

async function refreshBookList() {
    const searchTerm = sessionStorage.getItem('searching');
    const isSearching = searchTerm !== 'false';

    if (isSearching) await searchBooks(searchTerm);
    else await changeFilter();
}

function clearBooklistSelection() {
    $('.js-book-list-element').removeClass('selected');
    $('#bookForm').removeClass('js-is-visible');
    $('#bookDetails').html('');
    $('#bookFormWrapper').removeClass('form-displayed');
    ipcRenderer.send('disable-book-items');
}

function switchViewNoBooks() {
    $('#bookListWrapper').addClass('hidden');
    $('#bookFormWrapper').addClass('hidden');
    $('#mainColumnAnchor').removeClass('hidden');
}

function switchViewWithBooks() {
    $('#bookListWrapper').removeClass('hidden');
    $('#bookFormWrapper').removeClass('hidden');
    $('#mainColumnAnchor').addClass('hidden');
}

async function changeFilter() {
    const $element = $('.js-sidebar-list-element.selected');
    const queryType = $element.data('query-type');
    let rendered;

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

    sessionStorage.setItem('searching', false);
}

async function searchBooks(term) {
    $('.js-sidebar-list-element').removeClass('selected');
    const rendered = await filterBooks('search', term);
    switchViewWithBooks();
    $('#bookList').html(rendered);
    sessionStorage.setItem('searching', term);
}

function switchCss(id) {
    $('.js-main-css').prop('disabled', true);
    $(`#${id}`).prop('disabled', false);
}

function openModal(id) {
    const $modalContainer = $('#modalContainer');

    if (!$modalContainer.hasClass('hidden')) return;

    $modalContainer.removeClass('hidden');
    $(`#${id}`).removeClass('hidden');

    $(document).keydown(function(e) {
        if (e.keyCode === 27) closeModal(id);
    });
}

function closeModal(id) {
    $('#modalContainer').addClass('hidden');
    $(`#${id}`).addClass('hidden');
    $(document).unbind('keydown');
}

module.exports = {
    loadBook,
    selectBook,
    updateBookList,
    refreshBookList,
    clearBooklistSelection,
    switchViewNoBooks,
    switchViewWithBooks,
    changeFilter,
    searchBooks,
    switchCss,
    openModal,
    closeModal
};
