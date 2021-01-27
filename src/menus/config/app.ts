import { app, shell, dialog, MenuItemConstructorOptions, MenuItem, BrowserWindow } from 'electron';
import path from 'path';

import config from '../../config';
import { changeTheme } from '../../lib/preferences/theme';

const template: MenuItemConstructorOptions[] = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New Book',
        accelerator: 'CmdOrCtrl+N',
        click: (item: MenuItem, focusedWindow: BrowserWindow): void => {
          focusedWindow.webContents.send('create-new-book');
        },
      },
      {
        label: 'New Category',
        accelerator: 'CmdOrCtrl+Shift+N',
        click: (item: MenuItem, focusedWindow: BrowserWindow): void => {
          focusedWindow.webContents.send('create-new-category');
        },
      },
      { type: 'separator' },
      {
        id: 'saveBook',
        label: 'Save Book',
        accelerator: 'CmdOrCtrl+S',
        enabled: false,
        click: (item: MenuItem, focusedWindow: BrowserWindow): void => {
          focusedWindow.webContents.send('save-book');
        },
      },
      {
        id: 'deleteBook',
        label: 'Delete Book',
        accelerator: 'CmdOrCtrl+Shift+D',
        enabled: false,
        click: async (item: MenuItem, focusedWindow: BrowserWindow): Promise<void> => {
          const result = await dialog.showMessageBox({
            message: 'Are you sure you want to delete this book?',
            detail: 'You can\'t undo this action.',
            buttons: ['No', 'Yes'],
            type: 'warning',
            defaultId: 0,
            cancelId: 0,
          });

          if (result.response === 1) {
            focusedWindow.webContents.send('delete-book');
          }
        },
      },
      { type: 'separator' },
      { role: 'close' },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteAndMatchStyle' },
      { role: 'delete' },
      { role: 'selectAll' },
    ],
  },
  {
    label: 'View',
    submenu: [
      {
        id: 'lightTheme',
        label: 'Light Theme',
        type: 'checkbox',
        click: (item: MenuItem, focusedWindow: BrowserWindow): void => {
          changeTheme('light', focusedWindow);
        },
      },
      {
        id: 'darkTheme',
        label: 'Dark Theme',
        type: 'checkbox',
        click: (item: MenuItem, focusedWindow: BrowserWindow): void => {
          changeTheme('dark', focusedWindow);
        },
      },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
      { type: 'separator' },
      {
        label: 'Advanced',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
        ],
      },
    ],
  },
  {
    role: 'window',
    submenu: [
      { role: 'minimize' },
    ],
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Show Database Location',
        click: () => {
          const dbConfig = config.database;
          const databasePath = path.join(dbConfig.path, dbConfig.fileName);
          shell.showItemInFolder(databasePath);
        },
      },
      { type: 'separator' },
      {
        label: 'Submit Feedback',
        click: () => {
          shell.openExternal('https://www.alexseifert.com/contact');
        },
      },
      { type: 'separator' },
      {
        label: 'About Alex Seifert',
        click: () => {
          shell.openExternal('https://www.alexseifert.com');
        },
      },
    ],
  },
];

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {
        label: `About ${config.app.name}`,
        click: (item: MenuItem, focusedWindow: BrowserWindow): void => {
          focusedWindow.webContents.send('open-about');
        },
      },
      {
        label: 'Check for Updates...',
        click: (item: MenuItem, focusedWindow: BrowserWindow): void => {
          focusedWindow.webContents.send('check-for-updates');
        },
      },
      { type: 'separator' },
      {
        label: 'Preferences',
        accelerator: 'Cmd+,',
        click: (item: MenuItem, focusedWindow: BrowserWindow): void => {
          focusedWindow.webContents.send('open-preferences');
        },
      },
      { type: 'separator' },
      { role: 'services', submenu: [] },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' },
    ],
  });

  // Edit menu
  (template[2].submenu as MenuItemConstructorOptions[]).push(
    { type: 'separator' },
    {
      label: 'Speech',
      submenu: [
        { role: 'startSpeaking' },
        { role: 'stopSpeaking' },
      ],
    }
  );

  // Window menu
  template[4].submenu = [
    { role: 'minimize' },
    { role: 'zoom' },
    { type: 'separator' },
    { role: 'front' },
  ];
}
else {
  // Edit menu
  (template[1].submenu as MenuItemConstructorOptions[]).push(
    { type: 'separator' },
    {
      label: 'Preferences',
      accelerator: 'Ctrl+,',
      click: (item: MenuItem, focusedWindow: BrowserWindow): void => {
        focusedWindow.webContents.send('open-preferences');
      },
    }
  );


  // Help menu
  const helpMenu = template[4].submenu;
  template[4].submenu = [
    {
      label: 'Check for Updates...',
      click: (item: MenuItem, focusedWindow: BrowserWindow): void => {
        focusedWindow.webContents.send('check-for-updates');
      },
    },
    { type: 'separator' },
    helpMenu[0],
    { type: 'separator' },
    helpMenu[2],
    { type: 'separator' },
    helpMenu[4],
    {
      label: `About ${config.app.name}`,
      click: (item: MenuItem, focusedWindow: BrowserWindow): void => {
        focusedWindow.webContents.send('open-about');
      },
    },
  ];
}

export default template;
