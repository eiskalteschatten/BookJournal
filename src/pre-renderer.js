'use strict';

const $ = require('jquery');

const {loadPreferences} = require('./initialPreferences');


async function render() {
    $('body').addClass(process.platform);

    const preferences = await loadPreferences();

    $('.js-main-css').prop('disabled', true);
    $(`#${preferences.theme}Css`).prop('disabled', false);

    $('#defaultCss').remove();

    $('#sidebarWrapper').css('width', preferences.sidebarWidth + 'px');
    $('#bookListWrapper').css('width', preferences.middleColumnWidth + 'px');
}

render();
