'use strict';

const {ipcRenderer} = require('electron');
const $ = require('jquery');

const CategoryListElement = require('../elements/listElement/category');
const SidebarList = require('../elements/list/sidebar');


let $elementWithContextMenu;

$(document).on('contextmenu', '.js-category-list-element', function() { // eslint-disable-line
    $elementWithContextMenu = $(this);
    ipcRenderer.send('show-category-list-element-context-menu');
});


// New Category

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


// Category Colors

$(document).on('click', '.js-list-element-color', function() { // eslint-disable-line
    $(this).siblings('.js-list-element-color-form').trigger('click');
});

ipcRenderer.on('change-category-color', () => {
    $elementWithContextMenu.find('.js-list-element-color').trigger('click');
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


// Rename and delete Category

ipcRenderer.on('delete-category', async () => {
    const id = $elementWithContextMenu.data('id');
    const category = new CategoryListElement('', id, '');
    await category.delete();
    $elementWithContextMenu.remove();
});
