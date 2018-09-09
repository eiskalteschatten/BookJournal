'use strict';

const {ipcRenderer, shell} = require('electron');
const $ = require('jquery');

const helper = require('./helper');

const PreferencesModal = require('../elements/modal/preferences');


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



// About Modal

$(document).on('click', '#alexSeifertLink', function() {
    shell.openExternal('https://www.alexseifert.com');
});
