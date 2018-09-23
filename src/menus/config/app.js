'use strict';

const {app, shell, dialog} = require('electron');

const path = require('path');

const config = require('../../config/config');
const themePreferences = require('../../preferences/theme');


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
                id: 'saveBook',
                label: 'Save Book',
                accelerator: 'CmdOrCtrl+S',
                enabled: false,
                click: async (item, focusedWindow) => {
                    focusedWindow.webContents.send('save-book');
                }
            },
            {
                id: 'deleteBook',
                label: 'Delete Book',
                accelerator: 'CmdOrCtrl+Shift+D',
                enabled: false,
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
            {
                id: 'lightTheme',
                label: 'Light Theme',
                type: 'checkbox',
                click: (item, focusedWindow) => {
                    themePreferences.changeTheme('light', focusedWindow);
                }
            },
            {
                id: 'darkTheme',
                label: 'Dark Theme',
                type: 'checkbox',
                click: (item, focusedWindow) => {
                    themePreferences.changeTheme('dark', focusedWindow);
                }
            },
            {type: 'separator'},
            {role: 'resetzoom'},
            {role: 'zoomin'},
            {role: 'zoomout'},
            {type: 'separator'},
            {role: 'togglefullscreen'},
            {type: 'separator'},
            {
                label: 'Advanced',
                submenu: [
                    {role: 'reload'},
                    {role: 'forcereload'},
                    {role: 'toggledevtools'}
                ]
            },
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
                label: 'Show Database Location',
                click: () => {
                    const dbConfig = config.database;
                    const databasePath = path.join(dbConfig.path, dbConfig.fileName);
                    shell.showItemInFolder(databasePath);
                }
            },
            {type: 'separator'},
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
            {
                label: `About ${config.app.name}`,
                click: (item, focusedWindow) => {
                    focusedWindow.webContents.send('open-about');
                }
            },
            {
                label: 'Check for Updates...',
                click: (item, focusedWindow) => {
                    focusedWindow.webContents.send('check-for-updates');
                }
            },
            {type: 'separator'},
            {
                label: 'Preferences',
                accelerator: 'Cmd+,',
                click: (item, focusedWindow) => {
                    focusedWindow.webContents.send('open-preferences');
                }
            },
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
    // Edit menu
    template[1].submenu.push(
        {type: 'separator'},
        {
            label: 'Preferences',
            accelerator: 'Ctrl+,',
            click: (item, focusedWindow) => {
                focusedWindow.webContents.send('open-preferences');
            }
        }
    );


    // Help menu
    const helpMenu = template[4].submenu;
    template[4].submenu = [
        {
            label: 'Check for Updates...',
            click: (item, focusedWindow) => {
                focusedWindow.webContents.send('check-for-updates');
            }
        },
        {type: 'separator'},
        helpMenu[0],
        {
            label: `About ${config.app.name}`,
            click: (item, focusedWindow) => {
                focusedWindow.webContents.send('open-about');
            }
        }
    ];
}

module.exports = template;
