'use strict';

const $ = require('jquery');

const SidebarListElement = require('./elements/listElement/sidebar');
const CategoryListElement = require('./elements/listElement/category');


$(document).on('click', '.js-sidebar-list-element', function() { // eslint-disable-line
    SidebarListElement.onClick($(this));
});

$('.js-new-category').click(async e => {
    e.preventDefault();
    const newCategory = new CategoryListElement();
    await newCategory.showListEditor();
});


if (process.platform === 'darwin') {
    $('.js-title-bar').dblclick(() => {
        require('electron').remote.getCurrentWindow().maximize();
    });
}
