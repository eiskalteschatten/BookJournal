'use strict';


const template = [
    {
        label: 'Change Color',
        click: async (item, focusedWindow) => {
            focusedWindow.webContents.send('change-category-color');
        }
    },
    {type: 'separator'},
    {
        label: 'Rename',
        click: async (item, focusedWindow) => {
            focusedWindow.webContents.send('rename-category');
        }
    },
    {
        label: 'Delete',
        click: async (item, focusedWindow) => {
            focusedWindow.webContents.send('delete-category');
        }
    }
];

module.exports = template;
