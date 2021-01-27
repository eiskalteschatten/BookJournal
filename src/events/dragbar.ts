import $ from 'jquery';

import changePreferences from '../lib/preferences/change';

let dragging = false;

$('.js-dragbar').on('mousedown', (e: JQuery.TriggeredEvent): void => {
  e.preventDefault();

  const $draggableColumn = $(this).prev('.js-resizable-column');
  dragging = true;

  $(document).mousemove((e: JQuery.TriggeredEvent): void => {
    const newWidth = e.pageX - $draggableColumn.offset().left;
    $draggableColumn.css('width', newWidth);
  });
});

$(document).on('mouseup', async (): Promise<void> => {
  if (dragging) {
    $(document).off('mousemove');
    dragging = false;

    changePreferences({
      sidebarWidth: parseInt($('#sidebarWrapper').css('width')),
      middleColumnWidth: parseInt($('#bookListWrapper').css('width')),
    });
  }
});
