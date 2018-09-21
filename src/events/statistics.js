'use strict';

const {ipcRenderer} = require('electron');
const $ = require('jquery');

const BookPageCountYear = require('../elements/statisticsBox/bookPageCountYear');
const MonthYearBox = require('../elements/statisticsBox/monthYearBox');


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
    const bookCountBox = new MonthYearBox(counts);
    const rendered = await bookCountBox.render();
    const $element = $('#statisticsBookPageCountMonthYear');

    $element.removeClass('loading');
    $element.html(rendered);
});
