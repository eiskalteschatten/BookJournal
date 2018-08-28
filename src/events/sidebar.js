'use strict';

const $ = require('jquery');

const SidebarListElement = require('../elements/listElement/sidebar');


$(document).on('click', '.js-sidebar-list-element', async function() { // eslint-disable-line
    const renderedBookList = await SidebarListElement.onClick($(this));
    $('#bookList').html(renderedBookList);
});
