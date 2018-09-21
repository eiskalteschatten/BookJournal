'use strict';

const {ipcRenderer} = require('electron');
const $ = require('jquery');

const BookPageCountYear = require('../elements/statisticsBox/bookPageCountYear');
const BookPageCountMonthYear = require('../elements/statisticsBox/bookPageCountMonthYear');


ipcRenderer.on('statistics-render-page-book-count-year', async (event, allDatesRead, counts) => {
    const bookPageCountYear = new BookPageCountYear(counts, allDatesRead);
    const rendered = await bookPageCountYear.render();
    const $element = $('#statisticsBookPageCountYear');

    $element.removeClass('loading');
    $element.html(rendered);

    await bookPageCountYear.renderGraphs(
        $('#statisticsBooksReadYearGraph'),
        $('#statisticsPagesReadYearGraph')
    );
});

ipcRenderer.on('statistics-render-page-book-count-month-year', async (event, allDatesRead, counts) => {
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
});
