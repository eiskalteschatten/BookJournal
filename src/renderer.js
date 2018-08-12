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

async function renderSidebar() {
    const list = new SidebarList();
    list.addElement('All Books', '../assets/images/tmp.svg', 'all-books');
    list.addElement('Future Reading', '../assets/images/tmp.svg', 'future-reading');

    list.addTitleElement('Categories');

    const rendered = await list.render();
    $('#sidebar').html(rendered);
}

function renderBookList() {
    // const list = new List($('#bookList'));
}

render();
