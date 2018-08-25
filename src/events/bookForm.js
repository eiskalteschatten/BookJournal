'use strict';

const $ = require('jquery');


$(document).on('click', '.js-book-form-color-stripe', function() { // eslint-disable-line
    $(this).siblings('.js-book-form-color-form').click();
});

$(window).on('bookFormLoaded', e => { // eslint-disable-line
    console.log('book form has loaded', e);
});
