'use strict';

const $ = require('jquery');


module.exports = async () => {
    const theme = localStorage.getItem('theme') || 'light';  // eslint-disable-line

    $(`#${theme}Css`).prop('disabled', false);
    $('#defaultCss').remove();

    $('body').addClass(process.platform);

    const preferences = localStorage.getItem('preferences');  // eslint-disable-line

    $('#sidebarWrapper').css('width', preferences.sidebarWidth + 'px');
    $('#bookListWrapper').css('width', preferences.middleColumnWidth + 'px');

    const render = require('./renderer');
    await render();
};
