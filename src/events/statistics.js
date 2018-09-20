'use strict';

const {ipcRenderer} = require('electron');


ipcRenderer.on('statistics-set-session-storage', (event, allDatesRead) => {
    sessionStorage.setItem('allDatesRead', JSON.stringify(allDatesRead));
});

ipcRenderer.on('statistics-render-page-book-count-year', (event, countsYearNumber) => {
    console.log('countsYearNumber', countsYearNumber);
});

ipcRenderer.on('statistics-render-page-book-count-month-year', (event, countsMonthYearNumber) => {
    console.log('countsMonthYearNumber', countsMonthYearNumber);
});
