// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const $ = require('jquery');

const {loadPreferences} = require('./initialPreferences');
const SidebarList = require('./elements/list/sidebar');
const BooksList = require('./elements/list/books');

let preferences;


async function render() {
    $('body').addClass(process.platform);

    preferences = await loadPreferences();

    await renderBookList();
    await renderSidebar();

    $('.js-sidebar-list-element').first().trigger('click');
}

async function renderSidebar() {
    $('#sidebarWrapper').css('width', preferences.sidebarWidth + 'px');

    const list = new SidebarList();
    await list.loadCategories();

    const rendered = await list.render();
    const $sidebar = $('#sidebar');
    $sidebar.html(rendered);
    $sidebar.removeClass('loading');
}

async function renderBookList() {
    $('#bookListWrapper').css('width', preferences.middleColumnWidth + 'px');

    const list = new BooksList();
    await list.loadBooks();

    const rendered = await list.render();
    const $bookList = $('#bookList');
    $bookList.html(rendered);
    $bookList.removeClass('loading');
}

render();
