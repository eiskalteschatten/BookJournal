// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const $ = require('jquery');

const os = require('os');
const osType = os.type();

const SidebarList = require('./elements/list/sidebar');


function render() {
    $('body').addClass(osType.toLowerCase());

    if (osType !== 'Darwin') {
        $('.js-title-bar').hide();
    }

    renderSidebar();
    renderBookList();
}

function renderSidebar() {
    const list = new SidebarList($('#sidebar'));
    list.addElement('All Books', '', '');
    list.addElement('Future Reading', '', '');
    list.render();
}

function renderBookList() {
    // const list = new List($('#bookList'));
}

render();
