// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const $ = require('jquery');

const {loadPreferences} = require('./initialPreferences');
const SidebarList = require('./elements/list/sidebar');

let preferences;


async function render() {
    $('body').addClass(process.platform);

    preferences = await loadPreferences();

    await renderSidebar();
    await renderBookList();

    $('.js-sidebar-list-element').first().trigger('click');
}

async function renderSidebar() {
    const list = new SidebarList();
    await list.loadCategories();

    const rendered = await list.render();
    const $sidebar = $('#sidebar');
    $sidebar.html(rendered);
    $sidebar.removeClass('loading');

    $('#sidebarWrapper').css('width', preferences.sidebarWidth);
}

function renderBookList() {
    $('#bookListWrapper').css('width', preferences.middleColumnWidth);
}

render();
