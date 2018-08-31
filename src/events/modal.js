'use strict';

const {ipcRenderer} = require('electron');
const $ = require('jquery');

const helper = require('./helper');


ipcRenderer.on('open-about', () => {
    helper.openModal('aboutModal');
});

$(document).on('click', '.js-modal-close', function() { // eslint-disable-line
    const id = $(this).closest('.js-modal').attr('id');
    helper.closeModal(id);
});
