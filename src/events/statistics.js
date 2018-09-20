'use strict';

const {ipcRenderer} = require('electron');


ipcRenderer.on('statistics-years-months', (event, allDatesRead) => {
    sessionStorage.setItem('allDatesRead', JSON.stringify(allDatesRead));
});
