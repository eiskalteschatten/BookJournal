'use strict';

const $ = require('jquery');


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

$(document).mouseup(function(e) { // eslint-disable-line
    if (dragging) {
        $(document).unbind('mousemove'); // eslint-disable-line
        dragging = false;
    }
});
