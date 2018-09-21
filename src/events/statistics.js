'use strict';

const {ipcRenderer} = require('electron');


ipcRenderer.on('statistics-set-session-storage', (event, allDatesRead) => {
    sessionStorage.setItem('allDatesRead', JSON.stringify(allDatesRead));
});

ipcRenderer.on('statistics-render-page-book-count-year', (event, countsYear) => {
    console.log('countsYear', countsYear);
});

ipcRenderer.on('statistics-render-page-book-count-month-year', (event, countsMonthYear) => {
    console.log('countsMonthYear', countsMonthYear);
});
