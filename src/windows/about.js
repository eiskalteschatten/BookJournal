'use strict';

const path = require('path');

const Window = require('./window');


class AboutWindow extends Window {
    constructor() {
        const modalPath = path.join('file://', __dirname, '../html/about.html');
        const displayOptions = {
            width: 400,
            height: 320,
            resizable: false,
            minimizable: false,
            maximizable: false,
            title: '',
            autoHideMenuBar: true
        };

        super(modalPath, displayOptions);
    }
}

module.exports = AboutWindow;
