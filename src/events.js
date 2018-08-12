'use strict';

const $ = require('jquery');

const SidebarListElement = require('./elements/listElement/sidebar');


$(document).on('click', '.js-sidebar-list-element', () => {
    SidebarListElement.onClick($(this));
});
