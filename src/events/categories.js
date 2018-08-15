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
    $(this).siblings('.js-list-element-color-form').click();
});


let saveColorTimer;

$(document).on('change', '.js-list-element-color-form', async function() { // eslint-disable-line
    clearTimeout(saveColorTimer);

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

function openCategoryRenameMode($element) {
    $element.find('.js-list-element-name').addClass('hidden');

    const $edit = $element.find('.js-list-element-edit');
    $edit.removeClass('hidden');
    $edit.find('.js-list-element-edit-rename').focus();
}

ipcRenderer.on('rename-category', () => {
    openCategoryRenameMode($elementWithContextMenu);
});

$(document).on('dblclick', '.js-category-list-element', function() { // eslint-disable-line
    openCategoryRenameMode($(this));
});

$(document).on('blur', '.js-list-element-edit-rename', function() { // eslint-disable-line
    const $field = $(this);
    const $li = $field.closest('.js-category-list-element');
    const $edit = $li.find('.js-list-element-edit');
    const $name = $li.find('.js-list-element-name');

    $field.val($name.text());

    $edit.addClass('hidden');
    $name.removeClass('hidden');
});

$(document).on('keyup', '.js-list-element-edit-rename', async function(e) { // eslint-disable-line
    const $field = $(this);
    const $li = $field.closest('.js-category-list-element');
    const $edit = $li.find('.js-list-element-edit');
    const $name = $li.find('.js-list-element-name');

    const restore = () => {
        $edit.addClass('hidden');
        $name.removeClass('hidden');
    };

    if (e.keyCode === 27) { // esc should close the field
        $field.val($name.text());
        restore();
        return;
    }

    if (e.keyCode !== 13) return;

    const name = $field.val();
    const id = $li.data('id');
    const category = new CategoryListElement(name, id, '');
    await category.saveName();

    $name.text(name);
    restore();
    SidebarList.sortCategories();
});

ipcRenderer.on('delete-category', async () => {
    const id = $elementWithContextMenu.data('id');
    const category = new CategoryListElement('', id, '');
    await category.delete();
    $elementWithContextMenu.remove();
});
