'use strict';

const $ = require('jquery');

const Preferences = require('../models/preferences');


let dragging = false;

$('.js-dragbar').mousedown(function(e) {
    e.preventDefault();

    const $draggableColumn = $(this).prev('.js-resizable-column');

    dragging = true;

    $(document).mousemove(function(e) { // eslint-disable-line
        // $draggableColumn.css('width', e.pageX);
        var newWidth = e.pageX - $draggableColumn.offset().left;
        $draggableColumn.css('width', newWidth);
    });
});

$(document).mouseup(async function(e) { // eslint-disable-line
    if (dragging) {
        $(document).unbind('mousemove'); // eslint-disable-line
        dragging = false;

        const values = {
            sidebarWidth: parseInt($('#sidebarWrapper').css('width')),
            middleColumnWidth: parseInt($('#bookListWrapper').css('width'))
        };

        const preferences = await Preferences.findById(1);
        await preferences.updateAttributes(values);
    }
});
