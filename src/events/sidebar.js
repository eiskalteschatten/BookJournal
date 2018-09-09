'use strict';

const $ = require('jquery');

const eventHelper = require('./helper');


$(document).on('click', '.js-sidebar-list-element', async function() {
    $('.js-sidebar-list-element').removeClass('selected');
    $(this).addClass('selected');
    await eventHelper.changeFilter();
    eventHelper.clearBooklistSelection();
});
