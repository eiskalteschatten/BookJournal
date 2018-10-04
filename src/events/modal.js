'use strict';

const {ipcRenderer, remote} = require('electron');
const $ = require('jquery');

const helper = require('./helper');

const preferencesTheme = require('../lib/preferences/theme');
const PreferencesModal = require('../elements/modal/preferences');
const changePreferences = require('../lib/preferences/change');


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

$(document).on('click', '#preferencesFetchBooksByAuthor', function() {
    changePreferences({
        fetchBooksByAuthor: $(this).prop('checked')
    });
});

$(document).on('change', '#preferencesFetchBooksByAuthorLanguage', function() {
    changePreferences({
        fetchBooksByAuthorLanguage: $(this).val()
    });
});

$(document).on('click', '#preferencesCheckForUpdates', function() {
    changePreferences({
        checkForUpdates: $(this).prop('checked')
    });
});
