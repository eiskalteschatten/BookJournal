'use strict';

const {remote, shell} = require('electron');
const dialog = remote.dialog;
const $ = require('jquery');

const config = require('./config/config');


module.exports = async (showNoUpdateDialog = false) => {
    return new Promise((resolve, reject) => {
        try {
            let preferences = localStorage.getItem('preferences');
            preferences = JSON.parse(preferences);

            if (!preferences.checkForUpdates) {
                resolve();
                return;
            }

            $.getJSON(config.updates.url, data => {
                const versionInt = parseInt(config.app.version.replace(/[^0-9]/g, ''));
                const versionIntServer = parseInt(data.versionInt);

                if (versionInt < versionIntServer) {
                    dialog.showMessageBox({
                        message: 'An update is available',
                        detail: 'Would you like to download it?',
                        buttons: ['No', 'Yes'],
                        type: 'info',
                        defaultId: 1,
                        cancelId: 0
                    }, response => {
                        if (response === 1)
                            shell.openExternal(data.downloadUrl);

                        resolve(true);
                    });
                }
                else if (showNoUpdateDialog) {
                    dialog.showMessageBox({
                        message: 'There are currently no updates available.',
                        buttons: ['OK'],
                        type: 'info',
                        defaultId: 0,
                        cancelId: 0
                    });
                }

                resolve(false);
            });
        }
        catch(error) {
            reject(error);
        }
    }).catch(error => {
        console.log(error);
    });
};
