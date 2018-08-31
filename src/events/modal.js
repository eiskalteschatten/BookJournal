'use strict';

const {ipcRenderer, shell} = require('electron');
const $ = require('jquery');

const helper = require('./helper');


ipcRenderer.on('open-about', () => {
    helper.openModal('aboutModal');
});

$(document).on('click', '.js-modal-close', function() { // eslint-disable-line
    const id = $(this).closest('.js-modal').attr('id');
    helper.closeModal(id);
});



// About Modal

$(document).on('click', '#alexSeifertLink', function() { // eslint-disable-line
    shell.openExternal('https://www.alexseifert.com');
});
