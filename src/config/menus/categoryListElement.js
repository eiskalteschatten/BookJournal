'use strict';

const {dialog} = require('electron');


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
            dialog.showMessageBox({
                message: 'Are you sure you want to delete this category?',
                buttons: ['No', 'Yes'],
                type: 'question',
                defaultId: 0,
                cancelId: 0
            }, response => {
                if (response === 1)
                    focusedWindow.webContents.send('delete-category');
            });
        }
    }
];

module.exports = template;
