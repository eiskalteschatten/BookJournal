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
    if (data === 'category')
        createNewCategory();
});

$(document).on('blur', '.js-list-element-edit-name', function() { // eslint-disable-line
    const field = $(this);

    if (field && field.val() === '')
        field.remove();
});

$(document).on('keyup', '.js-list-element-edit-name', async function(e) { // eslint-disable-line
    const field = $(this);

    if (e.keyCode === 27) { // esc should cancel the field
        field.remove();
        return;
    }

    if (e.keyCode !== 13) return;

    const newCategory = new CategoryListElement(field.val());
    await newCategory.save();

    const rendered = await newCategory.render();
    field.remove();
    $('#sidebar').find('.js-list').append(rendered);
});


// macOS

if (process.platform === 'darwin') {
    $('.js-title-bar').dblclick(() => {
        require('electron').remote.getCurrentWindow().maximize();
    });
}
