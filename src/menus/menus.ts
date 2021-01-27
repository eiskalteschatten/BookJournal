import { BrowserWindow, Menu, ipcMain, IpcMainEvent } from 'electron';

import bookUtilityMenu from './config/bookUtility';
import bookcoverCm from './config/bookcoverCm';
import categoryListElementCm from './config/categoryListElementCm';
import inputCm from './config/inputCm';
import { switchMenu } from '../lib/preferences/theme';


ipcMain.on('show-category-list-element-context-menu', (event: IpcMainEvent): void => {
  const window = BrowserWindow.fromWebContents(event.sender);
  const menu = Menu.buildFromTemplate(categoryListElementCm);
  menu.popup({ window });
});

ipcMain.on('show-input-context-menu', (event: IpcMainEvent): void => {
  const window = BrowserWindow.fromWebContents(event.sender);
  const menu = Menu.buildFromTemplate(inputCm);
  menu.popup({ window });
});

ipcMain.on('show-book-utility-menu', (event: IpcMainEvent): void => {
  const window = BrowserWindow.fromWebContents(event.sender);
  const menu = Menu.buildFromTemplate(bookUtilityMenu);
  menu.popup({ window });
});

ipcMain.on('show-bookcover-context-menu', (event: IpcMainEvent): void => {
  const window = BrowserWindow.fromWebContents(event.sender);
  const menu = Menu.buildFromTemplate(bookcoverCm);
  menu.popup({ window });
});

ipcMain.on('enable-book-items', (): void => {
  const menu = Menu.getApplicationMenu();
  menu.getMenuItemById('saveBook').enabled = true;
  menu.getMenuItemById('deleteBook').enabled = true;
});

ipcMain.on('disable-book-items', (): void => {
  const menu = Menu.getApplicationMenu();
  menu.getMenuItemById('saveBook').enabled = false;
  menu.getMenuItemById('deleteBook').enabled = false;
});

ipcMain.on('switch-theme', (event: IpcMainEvent, theme: string): void => {
  switchMenu(theme);
});
