'use strict';

const {ipcRenderer} = require('electron');
const $ = require('jquery');

const SidebarListElement = require('./elements/listElement/sidebar');
const CategoryListElement = require('./elements/listElement/category');
const SidebarList = require('./elements/list/sidebar');


$(document).on('click', '.js-sidebar-list-element', function() { // eslint-disable-line
    SidebarListElement.onClick($(this));
});


// Categories

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
    const $field = $(this);

    if ($field && $field.val() === '')
        $field.closest('.js-list-element-edit').remove();
});

$(document).on('keyup', '.js-list-element-edit-name', async function(e) { // eslint-disable-line
    const $field = $(this);

    if (e.keyCode === 27) { // esc should close the field
        $field.closest('.js-list-element-edit').remove();
        return;
    }

    if (e.keyCode !== 13) return;

    const newCategory = new CategoryListElement($field.val());
    await newCategory.save();

    const rendered = await newCategory.render();
    $field.closest('.js-list-element-edit').remove();
    $('#sidebar').find('.js-list').append(rendered);

    SidebarList.sortCategories();
});

$(document).on('contextmenu', '.js-category-list-element', function() { // eslint-disable-line
    ipcRenderer.send('show-category-list-element-context-menu');
});

$(document).on('click', '.js-list-element-color', function() { // eslint-disable-line
    $(this).siblings('.js-list-element-color-form').trigger('click');
});

let saveColorTimer;

$(document).on('change', '.js-list-element-color-form', async function() { // eslint-disable-line
    saveColorTimer = null;

    const $colorForm = $(this);
    const color = $colorForm.val();
    $colorForm.siblings('.js-list-element-color').attr('style', `background-color: ${color}`);

    saveColorTimer = setTimeout(async function() {
        const $listElement = $colorForm.closest('.js-category-list-element');
        const id = $listElement.data('id');
        const category = new CategoryListElement('', id, color);
        await category.saveColor();
    }, 500);
});


// macOS

if (process.platform === 'darwin') {
    $('.js-title-bar').dblclick(() => {
        require('electron').remote.getCurrentWindow().maximize();
    });
}
