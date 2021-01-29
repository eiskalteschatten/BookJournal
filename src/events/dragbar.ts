import $ from 'jquery';

import changePreferences from '../lib/preferences/change';

let dragging = false;

$('.js-dragbar').on('mousedown', function(e: JQuery.TriggeredEvent): void {
  e.preventDefault();

  const $draggableColumn = $(this).prev('.js-resizable-column');
  dragging = true;

  $(document).on ('mousemove', function(e: JQuery.TriggeredEvent): void {
    const newWidth = e.pageX - $draggableColumn.offset().left;
    $draggableColumn.css('width', newWidth);
  });
});

$(document).on('mouseup', async function(): Promise<void> {
  if (dragging) {
    $(document).off('mousemove');
    dragging = false;

    changePreferences({
      sidebarWidth: parseInt($('#sidebarWrapper').css('width')),
      middleColumnWidth: parseInt($('#bookListWrapper').css('width')),
    });
  }
});
