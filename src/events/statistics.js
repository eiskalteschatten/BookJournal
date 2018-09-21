'use strict';

const {ipcRenderer} = require('electron');
const $ = require('jquery');

const YearBox = require('../elements/statisticsBox/yearBox');
const MonthYearBox = require('../elements/statisticsBox/monthYearBox');


ipcRenderer.on('statistics-set-session-storage', (event, allDatesRead) => {
    sessionStorage.setItem('allDatesRead', JSON.stringify(allDatesRead));
});

ipcRenderer.on('statistics-render-page-book-count-year', async (event, countsYear) => {
    const bookCountBox = new YearBox(countsYear.bookCount);
    const bookCountRendered = await bookCountBox.render();
    const $bookCountElement = $('#statisticsBooksReadYear');

    $bookCountElement.removeClass('loading');
    $bookCountElement.html(bookCountRendered);

    const pageCountBox = new YearBox(countsYear.pageCount);
    const pageCountRendered = await pageCountBox.render();
    const $pageCountElement = $('#statisticsPageCountYear');

    $pageCountElement.removeClass('loading');
    $pageCountElement.html(pageCountRendered);
});

ipcRenderer.on('statistics-render-page-book-count-month-year', async (event, countsMonthYear) => {
    const bookCountBox = new MonthYearBox(countsMonthYear.bookCount);
    const bookCountRendered = await bookCountBox.render();
    const $bookCountElement = $('#statisticsBooksReadMonth');

    $bookCountElement.removeClass('loading');
    $bookCountElement.html(bookCountRendered);

    const pageCountBox = new MonthYearBox(countsMonthYear.pageCount);
    const pageCountRendered = await pageCountBox.render();
    const $pageCountElement = $('#statisticsPageCountMonth');

    $pageCountElement.removeClass('loading');
    $pageCountElement.html(pageCountRendered);
});
