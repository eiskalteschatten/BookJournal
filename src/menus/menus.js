'use strict';

const { BrowserWindow, Menu, ipcMain } = require('electron');

const bookUtilityMenu = require('./config/bookUtility');
const bookcoverCm = require('./config/bookcoverCm');
const categoryListElementCm = require('./config/categoryListElementCm');
const inputCm = require('./config/inputCm');
const { switchMenu } = require('../lib/preferences/theme');


ipcMain.on('show-category-list-element-context-menu', event => {
  const window = BrowserWindow.fromWebContents(event.sender);
  const menu = Menu.buildFromTemplate(categoryListElementCm);
  menu.popup(window);
});

ipcMain.on('show-input-context-menu', event => {
  const window = BrowserWindow.fromWebContents(event.sender);
  const menu = Menu.buildFromTemplate(inputCm);
  menu.popup(window);
});

ipcMain.on('show-book-utility-menu', event => {
  const window = BrowserWindow.fromWebContents(event.sender);
  const menu = Menu.buildFromTemplate(bookUtilityMenu);
  menu.popup(window);
});

ipcMain.on('show-bookcover-context-menu', event => {
  const window = BrowserWindow.fromWebContents(event.sender);
  const menu = Menu.buildFromTemplate(bookcoverCm);
  menu.popup(window);
});

ipcMain.on('enable-book-items', () => {
  const menu = Menu.getApplicationMenu();
  menu.getMenuItemById('saveBook').enabled = true;
  menu.getMenuItemById('deleteBook').enabled = true;
});

ipcMain.on('disable-book-items', () => {
  const menu = Menu.getApplicationMenu();
  menu.getMenuItemById('saveBook').enabled = false;
  menu.getMenuItemById('deleteBook').enabled = false;
});

ipcMain.on('switch-theme', (event, theme) => {
  switchMenu(theme);
});
