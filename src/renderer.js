// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const $ = require('jquery');

const {loadPreferences} = require('./initialPreferences');
const SidebarList = require('./elements/list/sidebar');
const BookForm = require('./elements/bookForm');

let preferences;


async function render() {
    $('body').addClass(process.platform);

    preferences = await loadPreferences();

    renderBookList();
    await renderSidebar();
    await renderBookForm();

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

function renderBookList() {
    $('#bookListWrapper').css('width', preferences.middleColumnWidth + 'px');
}

async function renderBookForm() {
    const bookForm = new BookForm();
    const rendered = await bookForm.render();
    $('#bookDetails').html(rendered);

    const renderedStars = await bookForm.renderRatingStars();
    $('#ratingStarsAnchor').html(renderedStars);

    $(window).trigger('bookFormLoaded');  // eslint-disable-line
}

render();
