import { dialog, MenuItemConstructorOptions, MenuItem, BrowserWindow } from 'electron';

const template: MenuItemConstructorOptions[] = [
  {
    label: 'New Book',
    click: (item: MenuItem, focusedWindow: BrowserWindow): void => {
      focusedWindow.webContents.send('create-new-book');
    },
  },
  {
    label: 'Delete Book',
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
];

export default template;
