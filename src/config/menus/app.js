'use strict';

const {app, shell, dialog} = require('electron');

const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New Book',
                accelerator: 'CmdOrCtrl+N',
                click: async (item, focusedWindow) => {
                    focusedWindow.webContents.send('create-new-book');
                }
            },
            {
                label: 'New Category',
                accelerator: 'CmdOrCtrl+Shift+N',
                click: async (item, focusedWindow) => {
                    focusedWindow.webContents.send('create-new-category');
                }
            },
            {type: 'separator'},
            {
                label: 'Delete Book',
                accelerator: 'CmdOrCtrl+Shift+D',
                click: async (item, focusedWindow) => {
                    dialog.showMessageBox({
                        message: 'Are you sure you want to delete this book?',
                        detail: 'You can\'t undo this action.',
                        buttons: ['No', 'Yes'],
                        type: 'warning',
                        defaultId: 0,
                        cancelId: 0
                    }, response => {
                        if (response === 1)
                            focusedWindow.webContents.send('delete-book');
                    });
                }
            },
            {type: 'separator'},
            {role: 'close'}
        ]
    },
    {
        label: 'Edit',
        submenu: [
            {role: 'undo'},
            {role: 'redo'},
            {type: 'separator'},
            {role: 'cut'},
            {role: 'copy'},
            {role: 'paste'},
            {role: 'pasteandmatchstyle'},
            {role: 'delete'},
            {role: 'selectall'}
        ]
    },
    {
        label: 'View',
        submenu: [
            {role: 'reload'},
            {role: 'forcereload'},
            {role: 'toggledevtools'},
            {type: 'separator'},
            {role: 'resetzoom'},
            {role: 'zoomin'},
            {role: 'zoomout'},
            {type: 'separator'},
            {role: 'togglefullscreen'}
        ]
    },
    {
        role: 'window',
        submenu: [
            {role: 'minimize'}
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'About Alex Seifert',
                click: () => { shell.openExternal('https://www.alexseifert.com'); }
            }
        ]
    }
];

if (process.platform === 'darwin') {
    template.unshift({
        label: app.getName(),
        submenu: [
            {role: 'about'},
            {type: 'separator'},
            {role: 'services', submenu: []},
            {type: 'separator'},
            {role: 'hide'},
            {role: 'hideothers'},
            {role: 'unhide'},
            {type: 'separator'},
            {role: 'quit'}
        ]
    });

    // Edit menu
    template[2].submenu.push(
        {type: 'separator'},
        {
            label: 'Speech',
            submenu: [
                {role: 'startspeaking'},
                {role: 'stopspeaking'}
            ]
        }
    );

    // Window menu
    template[4].submenu = [
        {role: 'minimize'},
        {role: 'zoom'},
        {type: 'separator'},
        {role: 'front'}
    ];
}
else {
    // Help menu
    template[4].submenu.push(
        {role: 'about'}
    );
}

module.exports = template;
