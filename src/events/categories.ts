import { ipcRenderer } from 'electron';
import $ from 'jquery';

import CategoryListElement from '../elements/listElement/category';
import SidebarList from '../elements/list/sidebar';
import BookForm from '../elements/bookForm';

let $elementWithContextMenu: JQuery<HTMLElement>;

$(document).on('contextmenu', '.js-category-list-element', (): void => {
  $elementWithContextMenu = $(this);
  ipcRenderer.send('show-category-list-element-context-menu');
});

async function doneEditingCategories(): Promise<void> {
  const rendered = await BookForm.renderCategories();
  $('#bookCategoriesWrapper').html(rendered);
}


// New Category

async function createNewCategory(): Promise<void> {
  const newCategory = new CategoryListElement();
  await newCategory.showListEditor();
}

$('.js-new-category').on('click', async (e: JQuery.TriggeredEvent): Promise<void> => {
  e.preventDefault();
  createNewCategory();
});

ipcRenderer.on('create-new-category', async (): Promise<void> => {
  createNewCategory();
});

$(document).on('blur', '.js-list-element-edit-name', (): void => {
  const $field = $(this);

  if ($field && $field.val() === '') {
    $field.closest('.js-list-element-edit').remove();
  }
});

$(document).on('keyup', '.js-list-element-edit-name', async (e: JQuery.TriggeredEvent): Promise<void> => {
  const $field = $(this);

  if (e.key === 'Escape') { // esc should close the field
    $field.closest('.js-list-element-edit').remove();
    return;
  }

  if (e.key !== 'Enter') {
    return;
  }

  const newCategory = new CategoryListElement($field.val().toString());
  await newCategory.save();

  const rendered = await newCategory.render();
  $field.closest('.js-list-element-edit').remove();
  $('#sidebar').find('.js-list').append(rendered);

  SidebarList.sortCategories();
  doneEditingCategories();
});


// Category Colors

$(document).on('click', '.js-list-element-color', (): void => {
  $(this).siblings('.js-list-element-color-form').trigger('click');
});


let saveColorTimer;

$(document).on('change', '.js-list-element-color-form', async (): Promise<void> => {
  clearTimeout(saveColorTimer);

  const $colorForm = $(this);
  const color = $colorForm.val().toString();
  $colorForm.siblings('.js-list-element-color').attr('style', `background-color: ${color}`);

  saveColorTimer = setTimeout(async (): Promise<void> => {
    const $listElement = $colorForm.closest('.js-category-list-element');
    const id = $listElement.data('id');
    const category = new CategoryListElement('', id, color);
    await category.saveColor();
  }, 500);
});


// Rename and delete Category

function openCategoryRenameMode($element: JQuery<HTMLElement>): void {
  $element.find('.js-list-element-name').addClass('hidden');

  const $edit = $element.find('.js-list-element-edit');
  $edit.removeClass('hidden');
  $edit.find('.js-list-element-edit-rename').trigger('focus');
}

ipcRenderer.on('rename-category', (): void => {
  openCategoryRenameMode($elementWithContextMenu);
});

$(document).on('dblclick', '.js-category-list-element', (): void => {
  openCategoryRenameMode($(this));
});

$(document).on('blur', '.js-list-element-edit-rename', (): void => {
  const $field = $(this);
  const $li = $field.closest('.js-category-list-element');
  const $edit = $li.find('.js-list-element-edit');
  const $name = $li.find('.js-list-element-name');

  $field.val($name.text());

  $edit.addClass('hidden');
  $name.removeClass('hidden');
});

$(document).on('keyup', '.js-list-element-edit-rename', async (e: JQuery.TriggeredEvent): Promise<void> => {
  const $field = $(this);
  const $li = $field.closest('.js-category-list-element');
  const $edit = $li.find('.js-list-element-edit');
  const $name = $li.find('.js-list-element-name');

  const restore = () => {
    $edit.addClass('hidden');
    $name.removeClass('hidden');
  };

  if (e.key === 'Escape') { // esc should close the field
    $field.val($name.text());
    restore();
    return;
  }

  if (e.key !== 'Enter') {
    return;
  }

  const name = $field.val().toString();
  const id = $li.data('id');
  const category = new CategoryListElement(name, id, '');
  await category.saveName();

  $name.text(Array.isArray(name) ? name[0] : name);
  restore();
  SidebarList.sortCategories();
  doneEditingCategories();
});

ipcRenderer.on('delete-category', async () => {
  const id = $elementWithContextMenu.data('id');
  const category = new CategoryListElement('', id, '');
  await category.delete();
  $elementWithContextMenu.remove();
  doneEditingCategories();
});
