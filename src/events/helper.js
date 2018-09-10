'use strict';

const {ipcRenderer, remote, shell} = require('electron');
const dialog = remote.dialog;
const $ = require('jquery');

const config = require('../config/config');

const BookForm = require('../elements/bookForm');
const BooksList = require('../elements/list/books');
const filterBooks = require('../filters/books');


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

        $bookList.animate({
            scrollTop: position.top + $bookList.scrollTop()
        }, 100);
    }
}

async function updateBookList(selectedId) {
    const list = new BooksList();
    await list.loadBooks();

    const searchTerm = sessionStorage.getItem('searching');
    const isSearching = searchTerm !== 'false';

    if (isSearching) await searchBooks(searchTerm);
    else await changeFilter();

    if (selectedId !== '') selectBook(selectedId);
}

function clearBooklistSelection() {
    $('.js-book-list-element').removeClass('selected');
    $('#bookForm').removeClass('js-is-visible');
    $('#bookDetails').html('');
    $('#bookFormWrapper').removeClass('form-displayed');
    ipcRenderer.send('disable-book-items');
}

async function changeFilter() {
    const $element = $('.js-sidebar-list-element.selected');
    const rendered = await filterBooks($element.data('query-type'), $element.data('id'));
    $('#bookList').html(rendered);
    sessionStorage.setItem('searching', false);
}

async function searchBooks(term) {
    $('.js-sidebar-list-element').removeClass('selected');
    const rendered = await filterBooks('search', term);
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

async function checkForUpdates(showNoUpdateDialog = false) {
    return new Promise((resolve, reject) => {
        try {
            let preferences = localStorage.getItem('preferences');
            preferences = JSON.parse(preferences);

            if (!preferences.checkForUpdates) {
                resolve();
                return;
            }

            $.getJSON(config.updates.url, data => {
                const versionInt = parseInt(config.app.version.replace(/[^0-9]/g, ''));
                const versionIntServer = parseInt(data.versionInt);

                if (versionInt < versionIntServer) {
                    dialog.showMessageBox({
                        message: 'An update is available',
                        detail: 'Would you like to download it?',
                        buttons: ['No', 'Yes'],
                        type: 'info',
                        defaultId: 1,
                        cancelId: 0
                    }, response => {
                        if (response === 1)
                            shell.openExternal(data.downloadUrl);

                        resolve(true);
                    });
                }
                else if (showNoUpdateDialog) {
                    dialog.showMessageBox({
                        message: 'There are currently no updates available.',
                        buttons: ['OK'],
                        type: 'info',
                        defaultId: 0,
                        cancelId: 0
                    });
                }

                resolve(false);
            });
        }
        catch(error) {
            reject(error);
        }
    }).catch(error => {
        console.log(error);
    });
}

module.exports = {
    loadBook,
    selectBook,
    updateBookList,
    clearBooklistSelection,
    changeFilter,
    searchBooks,
    switchCss,
    openModal,
    closeModal,
    checkForUpdates
};
