'use strict';

const {BrowserWindow} = require('electron');

class AboutWindow {
    constructor(modalPath, displayOptions) {
        const window = new BrowserWindow(displayOptions);
        window.on('close', this.closeEvent);
        window.loadURL(modalPath);

        this.window = window;
    }

    open() {
        this.window.show();
    }

    closeEvent() {
        this.window = null;
    }
}

module.exports = AboutWindow;
