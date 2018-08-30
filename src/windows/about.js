'use strict';

const path = require('path');

const Window = require('./window');


class AboutWindow extends Window {
    constructor() {
        const modalPath = path.join('file://', __dirname, '../html/about.html');
        const displayOptions = {
            width: 525,
            height: 250,
            resizable: false,
            minimizable: false,
            maximizable: false,
            title: '',
            autoHideMenuBar: true,
            icon: path.join(__dirname, '../assets/icon128.png')
        };

        super(modalPath, displayOptions);
    }
}

module.exports = AboutWindow;
