
const { app, BrowserWindow } = require('electron');
const Main = require('../electron-dist/Main').default;

Main.main(app, BrowserWindow);
