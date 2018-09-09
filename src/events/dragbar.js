'use strict';

const $ = require('jquery');

const Preferences = require('../models/preferences');


let dragging = false;

$('.js-dragbar').mousedown(function(e) {
    e.preventDefault();

    const $draggableColumn = $(this).prev('.js-resizable-column');

    dragging = true;

    $(document).mousemove(function(e) {
        var newWidth = e.pageX - $draggableColumn.offset().left;
        $draggableColumn.css('width', newWidth);
    });
});

$(document).mouseup(async function() {
    if (dragging) {
        $(document).unbind('mousemove');
        dragging = false;

        const values = {
            sidebarWidth: parseInt($('#sidebarWrapper').css('width')),
            middleColumnWidth: parseInt($('#bookListWrapper').css('width'))
        };

        let preferences = await Preferences.findById(1);
        preferences = await preferences.updateAttributes(values);

        localStorage.setItem('preferences', JSON.stringify(preferences));
    }
});
