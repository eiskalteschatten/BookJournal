'use strict';

const {app} = require('electron');


const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New Book',
                accelerator: 'CmdOrCtrl+N',
                click: () => { console.log("new book"); }
            },
            {
                label: 'New Category',
                accelerator: 'CmdOrCtrl+Shift+N',
                click: () => { console.log("new category"); }
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
                click: () => { require('electron').shell.openExternal('https://www.alexseifert.com') }
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
    template[5].submenu.push(
        {role: 'about'}
    );
}

module.exports = template;
