'use strict';

const $ = require('jquery');

const SidebarListElement = require('../elements/listElement/sidebar');


$(document).on('click', '.js-sidebar-list-element', function() { // eslint-disable-line
    SidebarListElement.onClick($(this));
});
