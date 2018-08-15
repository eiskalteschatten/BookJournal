'use strict';


const template = [
    {role: 'cut'},
    {role: 'copy'},
    {role: 'paste'}
];

if (process.platform === 'darwin') {
    template.push(
        {type: 'separator'},
        {
            label: 'Speech',
            submenu: [
                {role: 'startspeaking'},
                {role: 'stopspeaking'}
            ]
        }
    );
}

module.exports = template;
