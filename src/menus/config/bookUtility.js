'use strict';

const { dialog } = require('electron');


const template = [
  {
    label: 'New Book',
    click: async (item, focusedWindow) => {
      focusedWindow.webContents.send('create-new-book');
    },
  },
  {
    label: 'Delete Book',
    click: async (item, focusedWindow) => {
      const result = await dialog.showMessageBox({
        message: 'Are you sure you want to delete this book?',
        detail: 'You can\'t undo this action.',
        buttons: ['No', 'Yes'],
        type: 'warning',
        defaultId: 0,
        cancelId: 0,
      });

      if (result.response === 1)
        focusedWindow.webContents.send('delete-book');
    },
  },
];

module.exports = template;
