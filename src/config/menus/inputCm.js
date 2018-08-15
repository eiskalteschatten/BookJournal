'use strict';


const template = [
    {role: 'cut'},
    {role: 'copy'},
    {role: 'paste'},
    {type: 'separator'},
    {
        label: 'Speech',
        submenu: [
            {role: 'startspeaking'},
            {role: 'stopspeaking'}
        ]
    }
];

module.exports = template;
