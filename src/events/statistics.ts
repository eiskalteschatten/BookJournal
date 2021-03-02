import { IpcRendererEvent } from 'electron';
import $ from 'jquery';

import BookPageCountYear from '../elements/statisticsBox/bookPageCountYear';
import BookPageCountMonthYear from '../elements/statisticsBox/bookPageCountMonthYear';
import Statistics from '../elements/statistics';
import { Statistics as IStatistics } from '../interfaces/statistics';

async function renderBookPageCountYear(statistics: IStatistics): Promise<void> {
  const bookPageCountYear = new BookPageCountYear(statistics);
  const rendered = await bookPageCountYear.render();
  const $element = $('#statisticsBookPageCountYear');

  $element.removeClass('loading');
  $element.html(rendered);

  await bookPageCountYear.renderGraphs(
    $('#statisticsBooksReadYearGraph'),
    $('#statisticsPagesReadYearGraph')
  );
}

async function renderBookPageCountMonthYear(statistics: IStatistics): Promise<void> {
  const bookPageCountMonthYear = new BookPageCountMonthYear(statistics);
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

window.api.on('statistics-no-results', async (): Promise<void> => {
  $('.js-statistics-hide-no-results').addClass('hidden');
  $('#statisticsNoResults').removeClass('hidden');
});

window.api.on('statistics-render-page-book-count-month-year', async function(event: IpcRendererEvent, statistics: IStatistics): Promise<void> {
  await renderBookPageCountMonthYear(statistics);
});

window.api.on('statistics-render-page-book-count-year', async function(event: IpcRendererEvent, statistics: IStatistics): Promise<void> {
  await renderBookPageCountYear(statistics);
});

$(document).on('change', '#statisticsChangeFirstYearRange, #statisticsChangeSecondYearRange', async function(): Promise<void> {
  const firstYear = Number($('#statisticsChangeFirstYearRange').val());
  const secondYear = Number($('#statisticsChangeSecondYearRange').val());

  const statistics = new Statistics();
  const allDatesRead = await statistics.getAllDatesRead();
  const countsYearObj = await statistics.calculateCountsYear(allDatesRead, firstYear, secondYear);

  await renderBookPageCountYear({
    allDatesRead,
    countsYearObj,
  });
});

$(document).on('change', '#statisticsChangeMonthYear', async function(): Promise<void> {
  const statistics = new Statistics();
  const allDatesRead = await statistics.getAllDatesRead();
  const countsMonthYear = await statistics.calculateCountsMonthYear(allDatesRead, Number($(this).val()));

  await renderBookPageCountMonthYear({
    allDatesRead,
    countsMonthYear,
  });
});
