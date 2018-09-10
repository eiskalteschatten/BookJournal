'use strict';

const {ipcRenderer, shell, remote} = require('electron');
const $ = require('jquery');

const helper = require('./helper');

const preferencesTheme = require('../preferences/theme');
const PreferencesModal = require('../elements/modal/preferences');
const changePreferences = require('../preferences/change');


ipcRenderer.on('open-about', () => {
    helper.openModal('aboutModal');
});

ipcRenderer.on('open-preferences', async () => {
    const preferencesModal = new PreferencesModal();
    const rendered = await preferencesModal.render();

    $('#modalAnchor').append(rendered);

    helper.openModal('preferencesModal');
});

$(document).on('click', '.js-modal-close', function() {
    const $modal = $(this).closest('.js-modal');
    const id = $modal.attr('id');
    helper.closeModal(id);

    if (id === 'preferencesModal') $modal.remove();
});



// Preferences Modal

$(document).on('click', '.js-preferences-theme', function() {
    const theme = $(this).data('theme');
    preferencesTheme.changeTheme(theme, remote.getCurrentWindow());
});

$(document).on('click', '#preferencesFetchBookInformation', function() {
    changePreferences({
        fetchBookInfoFromGoogle: $(this).prop('checked')
    });
});

$(document).on('click', '#preferencesCheckForUpdates', function() {
    changePreferences({
        checkForUpdates: $(this).prop('checked')
    });
});



// About Modal

$(document).on('click', '#alexSeifertLink', function() {
    shell.openExternal('https://www.alexseifert.com');
});
