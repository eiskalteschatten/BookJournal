'use strict';

const $ = require('jquery');

const changePreferences = require('../preferences/change');


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

        changePreferences({
            sidebarWidth: parseInt($('#sidebarWrapper').css('width')),
            middleColumnWidth: parseInt($('#bookListWrapper').css('width'))
        });
    }
});
