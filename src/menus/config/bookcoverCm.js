'use strict';

const { dialog } = require('electron');


const template = [
  {
    label: 'Set Color from Bookcover',
    click: async (item, focusedWindow) => focusedWindow.webContents.send('get-bookcover-color'),
  },
  {
    label: 'Delete Bookcover',
    click: async (item, focusedWindow) => {
      const result = await dialog.showMessageBox({
        message: 'Are you sure you want to delete this bookcover?',
        detail: 'You can\'t undo this action.',
        buttons: ['No', 'Yes'],
        type: 'warning',
        defaultId: 0,
        cancelId: 0,
      });

      if (result.response === 1)
        focusedWindow.webContents.send('delete-bookcover');
    },
  },
];

module.exports = template;
