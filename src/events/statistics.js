'use strict';

const {ipcRenderer} = require('electron');
const $ = require('jquery');

const BookPageCountYear = require('../elements/statisticsBox/bookPageCountYear');
const BookPageCountMonthYear = require('../elements/statisticsBox/bookPageCountMonthYear');


ipcRenderer.on('statistics-set-session-storage', (event, allDatesRead) => {
    sessionStorage.setItem('allDatesRead', JSON.stringify(allDatesRead));
});

ipcRenderer.on('statistics-render-page-book-count-year', async (event, counts) => {
    const bookPageCountYear = new BookPageCountYear(counts);
    const rendered = await bookPageCountYear.render();
    const $element = $('#statisticsBookPageCountYear');

    $element.removeClass('loading');
    $element.html(rendered);

    await bookPageCountYear.renderGraphs(
        $('#statisticsBooksReadYearGraph'),
        $('#statisticsPagesReadYearGraph')
    );
});

ipcRenderer.on('statistics-render-page-book-count-month-year', async (event, counts) => {
    const bookPageCountMonthYear = new BookPageCountMonthYear(counts);
    const rendered = await bookPageCountMonthYear.render();
    const $element = $('#statisticsBookPageCountMonthYear');

    $element.removeClass('loading');
    $element.html(rendered);

    await bookPageCountMonthYear.renderGraphs(
        $('#statisticsBooksReadMonthYearGraph'),
        $('#statisticsPagesReadMonthYearGraph'),
        $('#statisticsBooksReadMonthYearDoughnutGraph'),
        $('#statisticsPagesReadMonthYearDoughnutGraph')
    );
});
