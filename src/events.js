'use strict';

const {ipcRenderer} = require('electron');
const $ = require('jquery');

const SidebarListElement = require('./elements/listElement/sidebar');
const CategoryListElement = require('./elements/listElement/category');


$(document).on('click', '.js-sidebar-list-element', function() { // eslint-disable-line
    SidebarListElement.onClick($(this));
});


// Create New Category

async function createNewCategory() {
    const newCategory = new CategoryListElement();
    await newCategory.showListEditor();
}

$('.js-new-category').click(async e => {
    e.preventDefault();
    createNewCategory();
});

ipcRenderer.on('createNew', async (event, data) => {
    if (data === 'category') {
        createNewCategory();
    }
});


// macOS

if (process.platform === 'darwin') {
    $('.js-title-bar').dblclick(() => {
        require('electron').remote.getCurrentWindow().maximize();
    });
}
