import { ipcRenderer, IpcRendererEvent } from 'electron';
import $ from 'jquery';

import BookPageCountYear from '../elements/statisticsBox/bookPageCountYear';
import BookPageCountMonthYear from '../elements/statisticsBox/bookPageCountMonthYear';
import Statistics from '../elements/statistics';

// TODO: Add interfaces
async function renderBookPageCountYear(countsYearObj, allDatesRead): Promise<void> {
  const bookPageCountYear = new BookPageCountYear(countsYearObj, allDatesRead);
  const rendered = await bookPageCountYear.render();
  const $element = $('#statisticsBookPageCountYear');

  $element.removeClass('loading');
  $element.html(rendered);

  await bookPageCountYear.renderGraphs(
    $('#statisticsBooksReadYearGraph'),
    $('#statisticsPagesReadYearGraph')
  );
}

// TODO: Add interfaces
async function renderBookPageCountMonthYear(counts, allDatesRead): Promise<void> {
  const bookPageCountMonthYear = new BookPageCountMonthYear(counts, allDatesRead);
  const rendered = await bookPageCountMonthYear.render();
  const $element = $('#statisticsBookPageCountMonthYear');

  $element.html(rendered);

  await bookPageCountMonthYear.renderGraphs(
    $('#statisticsBooksReadMonthYearGraph'),
    $('#statisticsPagesReadMonthYearGraph'),
    $('#statisticsBooksReadMonthYearDoughnutGraph'),
    $('#statisticsPagesReadMonthYearDoughnutGraph')
  );
}

ipcRenderer.on('statistics-no-results', async (): Promise<void> => {
  $('.js-statistics-hide-no-results').addClass('hidden');
  $('#statisticsNoResults').removeClass('hidden');
});

// TODO: Add interfaces
ipcRenderer.on('statistics-render-page-book-count-month-year', async (event: IpcRendererEvent, counts, allDatesRead): Promise<void> => {
  await renderBookPageCountMonthYear(counts, allDatesRead);
});

// TODO: Add interfaces
ipcRenderer.on('statistics-render-page-book-count-year', async (event: IpcRendererEvent, countsYearObj, allDatesRead): Promise<void> => {
  await renderBookPageCountYear(countsYearObj, allDatesRead);
});

$(document).on('change', '#statisticsChangeFirstYearRange, #statisticsChangeSecondYearRange', async (): Promise<void> => {
  const firstYear = Number($('#statisticsChangeFirstYearRange').val());
  const secondYear = Number($('#statisticsChangeSecondYearRange').val());

  const statistics = new Statistics();
  const allDatesRead = await statistics.getAllDatesRead();
  const counts = await statistics.calculateCountsYear(allDatesRead, firstYear, secondYear);

  await renderBookPageCountYear(counts, allDatesRead);
});

$(document).on('change', '#statisticsChangeMonthYear', async (): Promise<void> => {
  const statistics = new Statistics();
  const allDatesRead = await statistics.getAllDatesRead();
  const countsYearObj = await statistics.calculateCountsMonthYear(allDatesRead, Number($(this).val()));

  await renderBookPageCountMonthYear(countsYearObj, allDatesRead);
});
