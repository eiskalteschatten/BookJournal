'use strict';

const { ipcRenderer } = require('electron');
const $ = require('jquery');

const BookPageCountYear = require('../elements/statisticsBox/bookPageCountYear');
const BookPageCountMonthYear = require('../elements/statisticsBox/bookPageCountMonthYear');
const Statistics = require('../elements/statistics');


async function renderBookPageCountYear(countsYearObj, allDatesRead) {
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

async function renderBookPageCountMonthYear(counts, allDatesRead) {
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

ipcRenderer.on('statistics-no-results', async () => {
  $('.js-statistics-hide-no-results').addClass('hidden');
  $('#statisticsNoResults').removeClass('hidden');
});

ipcRenderer.on('statistics-render-page-book-count-month-year', async (event, counts, allDatesRead) => {
  await renderBookPageCountMonthYear(counts, allDatesRead);
});

ipcRenderer.on('statistics-render-page-book-count-year', async (event, countsYearObj, allDatesRead) => {
  await renderBookPageCountYear(countsYearObj, allDatesRead);
});

$(document).on('change', '#statisticsChangeFirstYearRange, #statisticsChangeSecondYearRange', async function() {
  const firstYear =$('#statisticsChangeFirstYearRange').val();
  const secondYear =$('#statisticsChangeSecondYearRange').val();

  const statistics = new Statistics();
  const allDatesRead = await statistics.getAllDatesRead();
  const counts = await statistics.calculateCountsYear(allDatesRead, firstYear, secondYear);

  await renderBookPageCountYear(counts, allDatesRead);
});

$(document).on('change', '#statisticsChangeMonthYear', async function() {
  const statistics = new Statistics();
  const allDatesRead = await statistics.getAllDatesRead();
  const countsYearObj = await statistics.calculateCountsMonthYear(allDatesRead, $(this).val());

  await renderBookPageCountMonthYear(countsYearObj, allDatesRead);
});
